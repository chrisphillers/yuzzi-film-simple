'use client';
import { Box, Button, Form, FormField, TextInput, Text, Heading } from 'grommet';
import { useNewsletterValidation } from '../../app/hooks/useNewsletter';
import { useCreateSubscriber } from '../../app/hooks/useCreateSubscriber';
import { useState, useEffect } from 'react';

interface NewsletterProps {
  setShowNewsletter: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Newsletter: React.FC<NewsletterProps> = ({ setShowNewsletter }) => {
  const {
    formValue,
    setFormValue,
    validationMessage,
    showingError: showingValidationError,
    handleSubmit: validateForm,
    handleCancel: handleCancelValidation,
  } = useNewsletterValidation({
    onCancel: () => setShowNewsletter(false),
  });

  const { createSubscriber, loading: isSubmitting, error: apiError } = useCreateSubscriber();

  const [submissionStatusMessage, setSubmissionStatusMessage] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Handle success message display
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        handleCancelValidation();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess, handleCancelValidation]);

  const handleFormSubmit = async ({ value }: { value: { email: string } }) => {
    setSubmissionStatusMessage('');
    const isValid = validateForm({ value });

    if (isValid) {
      const result = await createSubscriber(value.email);

      if (result.success) {
        setFormValue({ email: '' });
        setShowSuccess(true);
      } else {
        // Use the error message directly from the result
        setSubmissionStatusMessage(result.error || 'An unexpected error occurred.');
      }
    } else {
    }
  };

  const handleCancel = () => {
    setSubmissionStatusMessage('');
    handleCancelValidation();
  };

  const getTextInputValue = () => {
    if (showingValidationError) {
      return validationMessage;
    }
    return formValue.email || '';
  };

  const getTextInputColor = () => {
    if (showingValidationError) {
      return 'red';
    }
    return 'inherit';
  };

  return (
    <Box>
      <Form value={formValue} onChange={setFormValue} validate="blur" onSubmit={handleFormSubmit}>
        <Box direction="row" align="center" justify="between" width="100%">
          <Box align="start">
            <Heading
              level={4}
              margin="none"
              weight={800}
              onClick={() => alert('click')}
              data-testid="brand-link"
            >
              YUZZI
            </Heading>
            {/* <YuzziHeading
              label="LE YUZZI"
              align={'center'}
              weight="heavy"
              href="/"
              data-testid="brand-link"
            /> */}
          </Box>

          <Box direction="row" align="center" justify="center" flex="grow" height="40px">
            {isSubmitting ? (
              <Box align="center" justify="center" height="40px">
                <Text data-testid="submitting-text" size="large">
                  Submitting...
                </Text>
              </Box>
            ) : showSuccess ? (
              <Box align="center" justify="center" height="40px">
                <Text data-testid="success-text" size="large">
                  Thank you for subscribing!
                </Text>
              </Box>
            ) : (
              <Box direction="row" align="center" gap="small">
                <FormField name="email" margin="none" htmlFor="email">
                  <TextInput
                    size="medium"
                    placeholder="Email"
                    aria-required
                    id="email"
                    name="email"
                    data-testid="email-input"
                    value={getTextInputValue()}
                    onChange={(event) =>
                      setFormValue({
                        ...formValue,
                        email: (event.target as HTMLInputElement).value,
                      })
                    }
                    style={{
                      color: getTextInputColor(),
                      transitionProperty: 'color',
                      transitionDuration: '0.4s',
                      transitionTimingFunction: 'ease',
                      height: '100%',
                    }}
                  />
                </FormField>
                <Button
                  type="submit"
                  label="SUBSCRIBE"
                  size="medium"
                  plain
                  data-testid="subscribe-button"
                  disabled={isSubmitting}
                  style={{
                    fontWeight: 'light',
                    fontSize: '18px',
                    height: '100%',
                  }}
                />
              </Box>
            )}
          </Box>
          <Box align="end">
            <Button
              plain
              size="medium"
              label="CANCEL"
              data-testid="cancel-button"
              style={{ fontWeight: 'light', fontSize: '19px' }}
              onClick={handleCancel}
              disabled={isSubmitting}
            />
          </Box>
        </Box>

        {/* TODO: Sort styling */}
        {submissionStatusMessage && (
          <Box pad={{ vertical: 'small' }} align="center">
            <Text color="status-error" size="small" data-testid="submission-error-text">
              {submissionStatusMessage}
            </Text>
          </Box>
        )}
      </Form>
    </Box>
  );
};
