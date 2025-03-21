'use client';
import { useState, useCallback } from 'react';
import { Box, Button, Form, FormField, TextInput, Anchor, BoxExtendedProps, Text } from 'grommet';
import { getEmailValidators } from '../../app/utils/email-validation';

const CONTENT_WIDTH_PROPS: BoxExtendedProps = {
  width: { max: '1000px' },
  margin: 'auto',
  pad: { horizontal: 'medium' },
  fill: 'horizontal',
};

export const NewsletterModal = ({
  setShowNewsletterModal,
}: {
  setShowNewsletterModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [formValue, setFormValue] = useState({ email: '' });
  const [validationMessage, setValidationMessage] = useState('');
  const [showingError, setShowingError] = useState(false);
  const [originalValue, setOriginalValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    ({ value }: { value: { email: string } }) => {
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
      console.log('Submit', value);

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
    setShowNewsletterModal(false);
  }, [setShowNewsletterModal]);

  return (
    <Box
      style={{
        zIndex: 2,
        position: 'absolute',
        top: '4px', //TODO: the smallest of style jumps between nav and newsletter, option to have orig brand show though via z-index went with this solution for now.
        width: 'calc(100% - 15px)',
        overflow: 'hidden', // Prevent internal overflow
      }}
      background="var(--color-background)"
    >
      <Box {...CONTENT_WIDTH_PROPS}>
        <Form value={formValue} onChange={setFormValue} validate="submit" onSubmit={handleSubmit}>
          <Box direction="row" align="center" justify="between" width="100%">
            <Box align="start">
              <Anchor size="medium" onClick={() => alert('click')}>
                LE YUZZI
              </Anchor>
            </Box>

            <Box direction="row" align="center" justify="center" flex="grow" height="40px">
              {isSubmitting ? (
                <Box align="center" justify="center" height="40px">
                  <Text
                    style={{
                      fontSize: '18px',
                      transitionProperty: 'color',
                      transitionDuration: '0.4s',
                      transitionTimingFunction: 'ease',
                    }}
                  >
                    Submitting...
                  </Text>
                </Box>
              ) : (
                <Box direction="row" align="center" height="40px">
                  <FormField htmlFor="email" name="email" margin="none">
                    <TextInput
                      size="medium"
                      placeholder="Email"
                      aria-required
                      id="email"
                      name="email"
                      value={showingError ? validationMessage : formValue.email || ''}
                      onChange={(event) =>
                        setFormValue({
                          ...formValue,
                          email: (event.target as HTMLInputElement).value,
                        })
                      }
                      style={{
                        color: showingError ? 'red' : 'inherit',
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
                    style={{
                      fontWeight: 'light',
                      fontSize: '18px',
                      color: 'black',
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
                style={{ fontWeight: 'light', fontSize: '18px', color: 'black' }}
                onClick={handleCancel}
              />
            </Box>
          </Box>
        </Form>
      </Box>
    </Box>
  );
};
