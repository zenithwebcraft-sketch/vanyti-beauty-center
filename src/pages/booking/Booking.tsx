import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useBookingFlow } from "@/lib/booking/useBookingFlow";
import { ServiceSelection } from "@/components/booking/ServiceSelection";
import { DateTimeSelection } from "@/components/booking/DateTimeSelection";

const Booking = () => {
  const { currentStep, formData, service, updateFormData, nextStep, previousStep } = useBookingFlow();

  const handleServiceSelect = (serviceId: string) => {
    updateFormData({ serviceId });
    nextStep();
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    updateFormData({ date, time });
    nextStep();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Reserva tu Cita
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Paso {currentStep === 'service' ? '1' : '2'} de 4
            </p>
          </div>
          <div className="w-32" /> {/* Spacer */}
        </div>

        {/* Progress bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'service' ? 'bg-pink-600 text-white' : 'bg-pink-200 text-pink-800'
              }`}>
                1
              </div>
              <span className="text-sm font-medium">Servicio</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-4" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'datetime' ? 'bg-pink-600 text-white' : 
                formData.date ? 'bg-pink-200 text-pink-800' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">Fecha/Hora</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-4" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-500">
                3
              </div>
              <span className="text-sm font-medium">Email</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-4" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-500">
                4
              </div>
              <span className="text-sm font-medium">Datos</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Main flow */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                {currentStep === 'service' && (
                  <ServiceSelection
                    onSelectService={handleServiceSelect}
                    selectedServiceId={formData.serviceId}
                  />
                )}

                {currentStep === 'datetime' && service && (
                  <>
                    <DateTimeSelection
                      onSelectDateTime={handleDateTimeSelect}
                      selectedDate={formData.date}
                      selectedTime={formData.time}
                      serviceDuration={service.durationMin}
                    />
                    <div className="flex gap-4 mt-8">
                      <Button
                        variant="outline"
                        onClick={previousStep}
                        className="flex-1"
                      >
                        Volver
                      </Button>
                      <Button
                        onClick={nextStep}
                        disabled={!formData.date || !formData.time}
                        className="flex-1"
                      >
                        Continuar
                      </Button>
                    </div>
                  </>
                )}

                {currentStep === 'email' && (
                  <div className="text-center py-8">
                    <h2 className="text-2xl font-semibold mb-4">
                      📧 Paso 3: Email
                    </h2>
                    <p className="text-gray-600">
                      Próximamente: Formulario de email
                    </p>
                  </div>
                )}

                {currentStep === 'details' && (
                  <div className="text-center py-8">
                    <h2 className="text-2xl font-semibold mb-4">
                      📝 Paso 4: Datos personales
                    </h2>
                    <p className="text-gray-600">
                      Próximamente: Formulario de datos
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Appointment summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-semibold mb-4 border-b pb-3">
                  Resumen de Cita
                </h3>

                {service ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Servicio</p>
                      <p className="font-medium">{service.title}</p>
                      <p className="text-sm text-gray-500">{service.durationMin} min</p>
                    </div>

                    {formData.date && formData.time && (
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600">Fecha y Hora</p>
                        <p className="font-medium">
                          {new Date(formData.date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-gray-500">{formData.time}</p>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600">Estilista</p>
                      <p className="font-medium">No Preference</p>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Subtotal</span>
                        <span className="font-medium">{service.priceEUR}€</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                        <span>Total</span>
                        <span className="text-pink-600">{service.priceEUR}€</span>
                      </div>
                    </div>

                    <div className="bg-pink-50 p-4 rounded-lg text-sm">
                      <p className="font-medium text-pink-900 mb-1">💳 Pay in person</p>
                      <p className="text-pink-800">Charged today: 0€</p>
                      <p className="text-pink-700 text-xs mt-2">
                        El pago se realizará en el salón después del servicio.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Selecciona un servicio para comenzar
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
