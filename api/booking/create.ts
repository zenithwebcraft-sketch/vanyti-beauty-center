import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const calendar = google.calendar('v3');

const getCalendarClient = () => {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  return { calendar, auth };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { serviceId, serviceTitle, dateTime, duration, email, phone, firstName, lastName } = req.body;

    // Validaciones
    if (!serviceId || !dateTime || !email || !phone || !firstName || !lastName) {
      return res.status(400).json({ 
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'All fields are required' } 
      });
    }

    const { auth } = getCalendarClient();

    // Calcular end time
    const startTime = new Date(dateTime);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    // Re-check availability (anti double-booking)
    const freeBusyResponse = await calendar.freebusy.query({
      auth,
      requestBody: {
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        items: [{ id: process.env.GOOGLE_CALENDAR_POOL_ID }],
      },
    });

    const busySlots = freeBusyResponse.data.calendars?.[process.env.GOOGLE_CALENDAR_POOL_ID!]?.busy || [];

    if (busySlots.length > 0) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'SLOT_NO_LONGER_AVAILABLE',
          message: 'This time slot was just booked by someone else. Please select another time.',
        },
      });
    }

    // Crear evento en Google Calendar
    const event = await calendar.events.insert({
      auth,
      calendarId: process.env.GOOGLE_CALENDAR_POOL_ID,
      requestBody: {
        summary: `${serviceTitle} – ${firstName} ${lastName}`,
        description: `📧 Email: ${email}\n📱 Tel: ${phone}\n\n🎯 Servicio: ${serviceTitle}\n💰 Cliente: ${firstName} ${lastName}`,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'Europe/Madrid',
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'Europe/Madrid',
        },
        transparency: 'opaque', // Bloquea el slot
      },
    });

    const bookingId = `VNY-${Date.now().toString().slice(-8)}`;

    // TODO: Enviar email de confirmación (próximo paso)

    return res.status(200).json({
      success: true,
      data: {
        bookingId,
        eventId: event.data.id,
        message: 'Booking created successfully',
      },
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'BOOKING_ERROR',
        message: error.message || 'Failed to create booking',
      },
    });
  }
}
