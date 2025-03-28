import { jest } from '@jest/globals';

// Mock environment variables
process.env.YUZZI_AWS_REGION = 'us-east-1';
process.env.YUZZI_AWS_ACCESS_KEY_ID = 'test-access-key';
process.env.YUZZI_AWS_SECRET_ACCESS_KEY = 'test-secret-key';
process.env.YUZZI_EMAIL_FROM_NAME = 'Test Sender';
process.env.YUZZI_EMAIL_FROM_ADDRESS = 'test@example.com';
process.env.YUZZI_MAILCHIMP_API_KEY = 'test-api-key';
process.env.YUZZI_MAILCHIMP_SERVER_PREFIX = 'test-server';
process.env.YUZZI_MAILCHIMP_LIST_ID = 'test-list-id';
process.env.YUZZI_FRONTEND_URL = 'http://localhost:3000';

// Mock AWS SES client
jest.mock('@aws-sdk/client-ses', () => ({
  SESClient: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({ MessageId: 'test-message-id' }),
  })),
  SendEmailCommand: jest.fn(),
}));

// Mock Mailchimp client
jest.mock('@mailchimp/mailchimp_marketing', () => ({
  setConfig: jest.fn(),
  lists: {
    addListMember: jest.fn().mockResolvedValue({ id: 'test-member-id' }),
  },
}));
