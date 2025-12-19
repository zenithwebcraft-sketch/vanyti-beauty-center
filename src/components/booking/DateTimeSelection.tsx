import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { generateTimeSlots, isSlotBusy } from '@/lib/booking/dateUtils';
import { fetchAvailability } from '@/lib/booking/api';
import { Clock, Loader2 } from 'lucide-react';

interface DateTimeSelectionProps {
  onSelectDateTime: (date: string, time: string) => void;
  selectedDate?: string;
  selectedTime?: string;
  serviceDuration: number;
  serviceId: string;
}

export const DateTimeSelection = ({
  onSelectDateTime,
  selectedDate,
  selectedTime,
  serviceDuration,
  serviceId,
}: DateTimeSelectionProps) => {
  const [date, setDate] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined
  );
  const [busyTimes, setBusyTimes] = useState<{ start: string; end: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dateStr = date ? format(date, 'yyyy-MM-dd') : '';
  const timeSlots = dateStr ? generateTimeSlots(dateStr) : [];

  // Fetch availability when date changes
  useEffect(() => {
    if (!dateStr) {
      setBusyTimes([]);
      return;
    }

    const loadAvailability = async () => {
      setLoading(true);
      setError('');
      try {
        const availability = await fetchAvailability(dateStr, serviceId);
        setBusyTimes(availability.busyTimes || []);
      } catch (err: any) {
        console.error('Error loading availability:', err);
        setError('Error al cargar disponibilidad. Inténtalo de nuevo.');
        setBusyTimes([]);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, [dateStr, serviceId]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const handleTimeSelect = (time: string) => {
    if (dateStr) {
      onSelectDateTime(dateStr, time);
    }
  };

  const isTimeSlotAvailable = (time: string): boolean => {
    if (!dateStr) return false;
    return !isSlotBusy(dateStr, time, serviceDuration, busyTimes);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Elige Fecha y Hora
        </h2>
        <p className="text-gray-600">
          Selecciona el día y horario que prefieres
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Selecciona una Fecha</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              locale={es}
              disabled={(date) => {
                const day = date.getDay();
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return day === 0 || date < today; // Domingo o pasado
              }}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horarios Disponibles
            </CardTitle>
            {dateStr && (
              <p className="text-sm text-gray-600">
                {format(date!, "EEEE, d 'de' MMMM", { locale: es })}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {!dateStr ? (
              <p className="text-center text-gray-500 py-8">
                Selecciona una fecha para ver horarios disponibles
              </p>
            ) : loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
                <span className="ml-2 text-gray-600">Cargando disponibilidad...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => setDate(new Date(date!))} variant="outline" size="sm">
                  Reintentar
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {timeSlots.map((time) => {
                  const available = isTimeSlotAvailable(time);
                  return (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : available ? 'outline' : 'ghost'}
                      className="w-full"
                      onClick={() => available && handleTimeSelect(time)}
                      disabled={!available}
                    >
                      {time}
                      {!available && <span className="ml-1 text-xs">(ocupado)</span>}
                    </Button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
