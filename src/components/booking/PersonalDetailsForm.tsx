import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Phone } from 'lucide-react';

interface PersonalDetailsFormProps {
  onSubmit: (data: { phone: string; firstName: string; lastName: string }) => void;
  onBack: () => void;
  initialData?: {
    phone?: string;
    firstName?: string;
    lastName?: string;
  };
}

export const PersonalDetailsForm = ({ 
  onSubmit, 
  onBack, 
  initialData = {} 
}: PersonalDetailsFormProps) => {
  const [phone, setPhone] = useState(initialData.phone || '');
  const [firstName, setFirstName] = useState(initialData.firstName || '');
  const [lastName, setLastName] = useState(initialData.lastName || '');
  const [errors, setErrors] = useState<{
    phone?: string;
    firstName?: string;
    lastName?: string;
  }>({});

  const validatePhone = (phone: string): boolean => {
    // Solo dígitos, al menos 9 caracteres
    const phoneRegex = /^\d{9,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const newErrors: typeof errors = {};

  if (!phone.trim()) {
    newErrors.phone = 'El teléfono es obligatorio';
  } else if (!validatePhone(phone)) {
    newErrors.phone = 'Ingresa un teléfono válido (solo números, mín. 9 dígitos)';
  }

  if (!firstName.trim()) {
    newErrors.firstName = 'El nombre es obligatorio';
  }

  if (!lastName.trim()) {
    newErrors.lastName = 'El apellido es obligatorio';
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});
  onSubmit({
    phone: phone.replace(/\s/g, ''),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
  });
};

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
          <User className="h-8 w-8 text-pink-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Completa tus datos
        </h2>
        <p className="text-gray-600">
          Necesitamos esta información para confirmar tu cita
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono móvil *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="tel"
              placeholder="663 491 339"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setErrors({ ...errors, phone: undefined });
              }}
              className={`pl-10 py-6 ${errors.phone ? 'border-red-500' : ''}`}
              autoFocus
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre *
          </label>
          <Input
            type="text"
            placeholder="María"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setErrors({ ...errors, firstName: undefined });
            }}
            className={`py-6 ${errors.firstName ? 'border-red-500' : ''}`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-2">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apellido *
          </label>
          <Input
            type="text"
            placeholder="García"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setErrors({ ...errors, lastName: undefined });
            }}
            className={`py-6 ${errors.lastName ? 'border-red-500' : ''}`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-2">{errors.lastName}</p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 py-6"
          >
            Volver
          </Button>
          <Button
            type="submit"
            className="flex-1 py-6"
          >
            Confirmar Cita
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          * Campos obligatorios
        </p>
      </form>
    </div>
  );
};
