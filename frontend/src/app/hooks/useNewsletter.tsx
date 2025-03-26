import { useState, useCallback } from 'react';
import { getEmailValidators } from '../../app/utils/email-validation';

interface NewsletterFormState {
  email: string;
}

interface UseNewsletterValidationProps {
  onCancel: () => void;
}

interface UseNewsletterValidationReturn {
  formValue: NewsletterFormState;
  setFormValue: React.Dispatch<React.SetStateAction<NewsletterFormState>>;
  validationMessage: string;
  showingError: boolean;
  isSubmitting: boolean;
  handleSubmit: ({ value }: { value: NewsletterFormState }) => void;
  handleCancel: () => void;
}

export const useNewsletterValidation = ({
  onCancel,
}: UseNewsletterValidationProps): UseNewsletterValidationReturn => {
  const [formValue, setFormValue] = useState<NewsletterFormState>({ email: '' });
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [showingError, setShowingError] = useState<boolean>(false);
  const [originalValue, setOriginalValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = useCallback(
    ({ value }: { value: NewsletterFormState }) => {
      // Validate email first
      const emailValidator = getEmailValidators()[0];
      const validationResult = emailValidator(value.email);

      if (validationResult) {
        // Store original value
        setOriginalValue(value.email);
        // Show error in input
        setValidationMessage(validationResult);
        setShowingError(true);

        // Reset after 1 second
        setTimeout(() => {
          setShowingError(false);
          // Restore original value if needed
          if (validationMessage) {
            setFormValue((prev) => ({ ...prev, email: originalValue }));
          }
        }, 1000);

        return;
      }

      // Valid submission
      console.info('Submit', value);

      // Show submitting state
      setIsSubmitting(true);

      // Simulate submission process (replace with actual submission)
      setTimeout(() => {
        setIsSubmitting(false);
        // You could reset the form here or show a success message
      }, 1000);
    },
    [validationMessage, originalValue]
  );

  const handleCancel = useCallback(() => {
    setFormValue({ email: '' });
    onCancel();
  }, [onCancel]);

  return {
    formValue,
    setFormValue,
    validationMessage,
    showingError,
    isSubmitting,
    handleSubmit,
    handleCancel,
  };
};
