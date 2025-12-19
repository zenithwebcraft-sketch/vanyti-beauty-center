import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { generateTimeSlots } from '@/lib/booking/dateUtils';
import { Clock } from 'lucide-react';

interface DateTimeSelectionProps {
  onSelectDateTime: (date: string, time: string) => void;
  selectedDate?: string;
  selectedTime?: string;
  serviceDuration: number;
}

export const DateTimeSelection = ({
  onSelectDateTime,
  selectedDate,
  selectedTime,
  serviceDuration,
}: DateTimeSelectionProps) => {
  const [date, setDate] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined
  );

  const dateStr = date ? format(date, 'yyyy-MM-dd') : '';
  const timeSlots = dateStr ? generateTimeSlots(dateStr) : [];

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const handleTimeSelect = (time: string) => {
    if (dateStr) {
      onSelectDateTime(dateStr, time);
    }
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
                return day === 0 || date < new Date(); // Domingo o pasado
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
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
