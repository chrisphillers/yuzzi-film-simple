interface EmailMessage {
  from?: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}

interface EmailAdapterConfig {
  payload: {
    logger: {
      info: (message: string) => void;
      error: (message: string, error?: Error | unknown) => void;
    };
  };
}

interface EmailAdapter {
  defaultFromName: string;
  defaultFromAddress: string;
  name: string;
  sendEmail: (message: EmailMessage) => Promise<{ MessageId: string }>;
}

const emailAdapter = ({ payload }: EmailAdapterConfig): EmailAdapter => {
  const fromName = process.env.YUZZI_EMAIL_FROM_NAME || 'Le Yuzzi';
  const fromAddress = process.env.YUZZI_EMAIL_FROM_ADDRESS || 'noreply@yuzzi.com';

  return {
    defaultFromName: fromName,
    defaultFromAddress: fromAddress,
    name: 'console',
    sendEmail: async (message: EmailMessage): Promise<{ MessageId: string }> => {
      try {
        // Log email attempt
        payload.logger.info(
          `[CONSOLE EMAIL] Attempting to send email to ${Array.isArray(message.to) ? message.to.join(', ') : message.to}`
        );

        // Log the email details to console
        console.log('=== EMAIL SENT (Console Adapter) ===');
        console.log('From:', message.from || `${fromName} <${fromAddress}>`);
        console.log('To:', Array.isArray(message.to) ? message.to.join(', ') : message.to);
        console.log('Subject:', message.subject);
        if (message.html) {
          console.log('HTML Body:', message.html);
        }
        if (message.text) {
          console.log('Text Body:', message.text);
        }
        console.log('====================================');

        // Log successful send
        payload.logger.info(
          `[CONSOLE EMAIL] Successfully logged email to ${Array.isArray(message.to) ? message.to.join(', ') : message.to}`
        );

        return { MessageId: `console-${Date.now()}` };
      } catch (error: unknown) {
        // Log detailed error
        payload.logger.error('[CONSOLE EMAIL] Failed to log email', {
          error,
          to: message.to,
          subject: message.subject,
        });

        // Rethrow with more context
        if (error instanceof Error) {
          throw new Error(`Failed to log email: ${error.message}`);
        }
        throw new Error('Failed to log email: Unknown error');
      }
    },
  };
};

export default emailAdapter;
