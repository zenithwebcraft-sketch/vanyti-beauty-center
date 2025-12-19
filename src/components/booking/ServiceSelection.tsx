import { services } from '@/config/siteConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Euro } from 'lucide-react';

interface ServiceSelectionProps {
  onSelectService: (serviceId: string) => void;
  selectedServiceId?: string;
}

export const ServiceSelection = ({ onSelectService, selectedServiceId }: ServiceSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Selecciona tu Servicio
        </h2>
        <p className="text-gray-600">
          Elige el tratamiento que deseas reservar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services
          .filter((s) => s.priceEUR && s.priceEUR > 0) // Solo servicios con precio
          .map((service) => (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedServiceId === service.id
                  ? 'ring-2 ring-pink-500 border-pink-500'
                  : 'hover:border-pink-300'
              }`}
              onClick={() => onSelectService(service.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{service.title}</span>
                  <span className="text-pink-600 text-xl font-bold flex items-center gap-1">
                    {service.priceEUR}
                    <Euro className="h-5 w-5" />
                  </span>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  {service.durationMin} minutos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">{service.description}</p>
                <Button
                  className="w-full"
                  variant={selectedServiceId === service.id ? 'default' : 'outline'}
                >
                  {selectedServiceId === service.id ? '✓ Seleccionado' : 'Seleccionar'}
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};
