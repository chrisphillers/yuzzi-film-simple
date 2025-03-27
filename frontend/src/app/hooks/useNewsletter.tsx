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
  handleSubmit: ({ value }: { value: NewsletterFormState }) => boolean;
  handleCancel: () => void;
}

export const useNewsletterValidation = ({
  onCancel,
}: UseNewsletterValidationProps): UseNewsletterValidationReturn => {
  const [formValue, setFormValue] = useState<NewsletterFormState>({ email: '' });
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [showingError, setShowingError] = useState<boolean>(false);
  const [originalValue, setOriginalValue] = useState<string>('');

  const handleSubmit = useCallback(
    ({ value }: { value: NewsletterFormState }): boolean => {
      // Clear previous errors before validation
      setValidationMessage('');
      setShowingError(false);

      const emailValidator = getEmailValidators()[0];
      const validationResult = emailValidator(value.email);

      if (validationResult) {
        // Validation failed
        setOriginalValue(value.email);
        setValidationMessage(validationResult);
        setShowingError(true);

        // Reset error display after 1 second
        setTimeout(() => {
          setShowingError(false);
          // Restore original value visually if needed, but keep error message conceptually
          // setFormValue((prev) => ({ ...prev, email: originalValue })); // Maybe not needed if controlled input displays validationMessage
        }, 1000);

        return false; // Indicate validation failed
      }

      // Validation passed
      return true; // Indicate validation succeeded

      // ---- Removed API Submission Logic ----
    },
    // Dependencies: only need originalValue if we restore it visually
    [
      /* originalValue */
    ]
  );

  const handleCancel = useCallback(() => {
    setFormValue({ email: '' });
    setValidationMessage(''); // Clear any validation errors on cancel
    setShowingError(false);
    onCancel();
  }, [onCancel]);

  return {
    formValue,
    setFormValue,
    validationMessage,
    showingError,
    handleSubmit,
    handleCancel,
  };
};
