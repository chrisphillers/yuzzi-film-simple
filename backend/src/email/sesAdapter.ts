import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { EmailAdapter, EmailOptions } from 'payload/config';

const ses = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const sesAdapter = (): EmailAdapter => ({
  fromName: process.env.EMAIL_FROM_NAME || 'Le Yuzzi',
  fromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@leyuzzi.com',
  transport: async ({ to, subject, html, text }: EmailOptions) => {
    const command = new SendEmailCommand({
      Source: `${process.env.EMAIL_FROM_NAME || 'Le Yuzzi'} <${process.env.EMAIL_FROM_ADDRESS || 'noreply@leyuzzi.com'}>`,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Html: {
            Data: html,
          },
          Text: {
            Data: text,
          },
        },
      },
    });

    try {
      await ses.send(command);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  },
});
