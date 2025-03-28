import { jest, test, expect, beforeEach } from '@jest/globals';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import emailAdapter from '../../email/sesAdapter';

// Mock AWS SES
jest.mock('@aws-sdk/client-ses', () => ({
  SESClient: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({ MessageId: 'test-message-id' }),
  })),
  SendEmailCommand: jest.fn(),
}));

// Mock environment variables
process.env.YUZZI_AWS_REGION = 'us-east-1';
process.env.YUZZI_AWS_ACCESS_KEY_ID = 'test-key';
process.env.YUZZI_AWS_SECRET_ACCESS_KEY = 'test-secret';
process.env.YUZZI_EMAIL_FROM_NAME = 'Test Sender';
process.env.YUZZI_EMAIL_FROM_ADDRESS = 'test@example.com';

let adapter: ReturnType<typeof emailAdapter>;
let mockLogger: { info: jest.Mock; error: jest.Mock };

beforeEach(() => {
  // Clear all mocks
  jest.clearAllMocks();

  mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
  };

  adapter = emailAdapter({
    payload: {
      logger: mockLogger,
    },
  });
});

test('should initialize with correct default values', () => {
  expect(adapter.defaultFromName).toBe('Test Sender');
  expect(adapter.defaultFromAddress).toBe('test@example.com');
  expect(adapter.name).toBe('ses');
});

test('should throw error if required environment variables are missing', () => {
  const originalEnv = process.env;
  process.env = { NODE_ENV: originalEnv.NODE_ENV };

  expect(() => {
    emailAdapter({
      payload: {
        logger: mockLogger,
      },
    });
  }).toThrow(/Missing required environment variables/);

  process.env = originalEnv;
});

test('should successfully send an email', async () => {
  const message = {
    to: 'recipient@example.com',
    subject: 'Test Subject',
    html: '<p>Test HTML</p>',
    text: 'Test Text',
  };

  const result = await adapter.sendEmail(message);

  expect(result).toEqual({ MessageId: 'test-message-id' });
  expect(mockLogger.info).toHaveBeenCalledTimes(2);
  expect(SendEmailCommand).toHaveBeenCalledWith({
    Source: 'Test Sender <test@example.com>',
    Destination: {
      ToAddresses: ['recipient@example.com'],
    },
    Message: {
      Subject: {
        Data: 'Test Subject',
      },
      Body: {
        Html: {
          Data: '<p>Test HTML</p>',
        },
        Text: {
          Data: 'Test Text',
        },
      },
    },
  });
});

test('should handle array of recipients', async () => {
  const message = {
    to: ['recipient1@example.com', 'recipient2@example.com'],
    subject: 'Test Subject',
  };

  await adapter.sendEmail(message);

  expect(SendEmailCommand).toHaveBeenCalledWith(
    expect.objectContaining({
      Destination: {
        ToAddresses: ['recipient1@example.com', 'recipient2@example.com'],
      },
    })
  );
});

test('should handle custom from address', async () => {
  const message = {
    from: 'custom@example.com',
    to: 'recipient@example.com',
    subject: 'Test Subject',
  };

  await adapter.sendEmail(message);

  expect(SendEmailCommand).toHaveBeenCalledWith(
    expect.objectContaining({
      Source: 'custom@example.com',
    })
  );
});

test('should handle email sending errors', async () => {
  const mockError = new Error('SES Error');
  const mockSend = jest.fn().mockRejectedValue(mockError);
  (SESClient as jest.Mock).mockImplementationOnce(() => ({
    send: mockSend,
  }));

  // Create a new adapter instance to use the mocked SESClient
  const errorAdapter = emailAdapter({
    payload: {
      logger: mockLogger,
    },
  });

  const message = {
    to: 'recipient@example.com',
    subject: 'Test Subject',
  };

  await expect(errorAdapter.sendEmail(message)).rejects.toThrow('Failed to send email: SES Error');
  expect(mockLogger.error).toHaveBeenCalledWith('Failed to send email', {
    error: mockError,
    to: 'recipient@example.com',
    subject: 'Test Subject',
  });
});
