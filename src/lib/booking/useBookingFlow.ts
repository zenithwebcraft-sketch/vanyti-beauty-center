import { useState } from 'react';
import { BookingFormData } from './types';
import { getServiceById } from '@/config/siteConfig';

export type BookingStep = 'service' | 'datetime' | 'email' | 'details' | 'confirmation';

export const useBookingFlow = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('service');
  const [formData, setFormData] = useState<Partial<BookingFormData>>({});

  const service = formData.serviceId ? getServiceById(formData.serviceId) : null;

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const goToStep = (step: BookingStep) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    const steps: BookingStep[] = ['service', 'datetime', 'email', 'details', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const previousStep = () => {
    const steps: BookingStep[] = ['service', 'datetime', 'email', 'details', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const reset = () => {
    setCurrentStep('service');
    setFormData({});
  };

  return {
    currentStep,
    formData,
    service,
    updateFormData,
    goToStep,
    nextStep,
    previousStep,
    reset,
  };
};
