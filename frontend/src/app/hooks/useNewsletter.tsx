'use client';
import { useState, useCallback, useEffect } from 'react';
import { getEmailValidators } from '../utils/email-validation';
import { FormSubmitEvent, NewsletterFormValue } from '../types/newsletter';

/**
 * Custom hook to manage newsletter form state and logic
 * Separates business logic from UI components
 */
export const useNewsletterForm = (
  setShowNewsletterModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [formValue, setFormValue] = useState<NewsletterFormValue>({ email: '' });
  const [validationMessage, setValidationMessage] = useState('');
  const [showingError, setShowingError] = useState(false);
  const [originalValue, setOriginalValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset error message after timeout
  useEffect(() => {
    if (showingError) {
      const timer = setTimeout(() => {
        setShowingError(false);

        // Restore original value if needed
        if (validationMessage) {
          setFormValue((prev) => ({ ...prev, email: originalValue }));
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showingError, validationMessage, originalValue]);

  // Handle form input changes
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormValue((prev) => ({ ...prev, email: value }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(({ value }: FormSubmitEvent) => {
    // Validate email
    const emailValidator = getEmailValidators()[0];
    const validationResult = emailValidator(value.email);

    if (validationResult) {
      // Store original value and show error
      setOriginalValue(value.email);
      setValidationMessage(validationResult);
      setShowingError(true);
      return;
    }

    // Valid submission
    console.log('Submit', value);
    setIsSubmitting(true);

    // Simulate submission (replace with actual API call)
    const timer = setTimeout(() => {
      setIsSubmitting(false);
      setFormValue({ email: '' });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle cancel button click
  const handleCancel = useCallback(() => {
    setFormValue({ email: '' });
    setShowNewsletterModal(false);
  }, [setShowNewsletterModal]);

  return {
    formValue,
    setFormValue,
    showingError,
    validationMessage,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleCancel,
  };
};
