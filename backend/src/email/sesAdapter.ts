import { SESClient, SendEmailCommand, SendEmailCommandOutput } from '@aws-sdk/client-ses';

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
  sendEmail: (message: EmailMessage) => Promise<SendEmailCommandOutput>;
}

const emailAdapter = ({ payload }: EmailAdapterConfig): EmailAdapter => {
  // Validate required environment variables
  const requiredEnvVars = [
    'YUZZI_AWS_REGION',
    'YUZZI_AWS_ACCESS_KEY_ID',
    'YUZZI_AWS_SECRET_ACCESS_KEY',
  ];
  const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }

  // Type assertion since we've validated the environment variables
  const ses = new SESClient({
    region: process.env.YUZZI_AWS_REGION as string,
    credentials: {
      accessKeyId: process.env.YUZZI_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.YUZZI_AWS_SECRET_ACCESS_KEY as string,
    },
  });

  const fromName = process.env.YUZZI_EMAIL_FROM_NAME || 'Le Yuzzi';
  const fromAddress = process.env.YUZZI_EMAIL_FROM_ADDRESS || 'noreply@yuzzi.com';

  return {
    defaultFromName: fromName,
    defaultFromAddress: fromAddress,
    name: 'ses',
    sendEmail: async (message: EmailMessage): Promise<SendEmailCommandOutput> => {
      try {
        // Log email attempt
        payload.logger.info(
          `Attempting to send email to ${Array.isArray(message.to) ? message.to.join(', ') : message.to}`
        );

        const command = new SendEmailCommand({
          Source: message.from || `${fromName} <${fromAddress}>`,
          Destination: {
            ToAddresses: Array.isArray(message.to) ? message.to : [message.to],
          },
          Message: {
            Subject: {
              Data: message.subject,
            },
            Body: {
              Html: message.html
                ? {
                    Data: message.html,
                  }
                : undefined,
              Text: message.text
                ? {
                    Data: message.text,
                  }
                : undefined,
            },
          },
        });

        const result = await ses.send(command);

        // Log successful send
        payload.logger.info(
          `Successfully sent email to ${Array.isArray(message.to) ? message.to.join(', ') : message.to}`
        );

        return result;
      } catch (error: unknown) {
        // Log detailed error
        payload.logger.error('Failed to send email', {
          error,
          to: message.to,
          subject: message.subject,
        });

        // Rethrow with more context
        if (error instanceof Error) {
          throw new Error(`Failed to send email: ${error.message}`);
        }
        throw new Error('Failed to send email: Unknown error');
      }
    },
  };
};

export default emailAdapter;
