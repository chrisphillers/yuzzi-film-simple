'use client';
import { Box, Button, Form, FormField, TextInput, Text, Heading } from 'grommet';
import { useNewsletterValidation } from '../../app/hooks/useNewsletter';

interface NewsletterProps {
  setShowNewsletter: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Newsletter: React.FC<NewsletterProps> = ({ setShowNewsletter }) => {
  const {
    formValue,
    setFormValue,
    validationMessage,
    showingError,
    isSubmitting,
    handleSubmit,
    handleCancel,
  } = useNewsletterValidation({
    onCancel: () => setShowNewsletter(false),
  });

  return (
    <Box>
      <Form value={formValue} onChange={setFormValue} validate="submit" onSubmit={handleSubmit}>
        <Box direction="row" align="center" justify="between" width="100%">
          <Box align="start">
            <Heading
              level={4}
              margin="none"
              weight={800}
              onClick={() => alert('click')}
              data-testid="brand-link"
            >
              LE YUZZI
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
                <Text
                  data-testid="submitting-text"
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
              <Box direction="row" align="center">
                <FormField name="email" margin="none" htmlFor="email">
                  <TextInput
                    size="medium"
                    placeholder="Email"
                    aria-required
                    id="email"
                    name="email"
                    data-testid="email-input"
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
                  data-testid="subscribe-button"
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
            />
          </Box>
        </Box>
      </Form>
    </Box>
  );
};
