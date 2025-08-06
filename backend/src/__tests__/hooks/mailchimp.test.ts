import { jest, test, expect, beforeEach, afterEach } from '@jest/globals';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { addSubscriberToMailchimp } from '../../hooks/mailchimp';
import type { Payload } from 'payload';

// Define types for mocked responses
type MailchimpResponse = {
  id: string;
};

// Define types for Mailchimp errors
interface MailchimpErrorResponse {
  response: {
    body?: {
      title?: string;
    };
    status?: number;
  };
}

interface MailchimpError extends Error {
  response?: {
    body?: {
      title?: string;
    };
    status?: number;
  };
}

// Store original environment variables
const originalEnv = process.env;

// Mock Mailchimp
jest.mock('@mailchimp/mailchimp_marketing', () => {
  const mockAddListMember = jest
    .fn()
    .mockResolvedValue({ id: 'test-member-id' } as MailchimpResponse);
  return {
    setConfig: jest.fn(),
    lists: {
      addListMember: mockAddListMember,
    },
  };
});

beforeEach(() => {
  // Reset environment variables before each test
  process.env = { ...originalEnv };
  process.env.YUZZI_FRONTEND_URL = 'http://localhost:3000';
  process.env.YUZZI_MAILCHIMP_LIST_ID = 'test-list-id';
  jest.clearAllMocks();
});

afterEach(() => {
  // Restore environment variables after each test
  process.env = originalEnv;
});

// Mock the Payload object
const mockPayload = {} as unknown as Payload;

test('should successfully add a subscriber', async () => {
  const email = 'test@example.com';
  const result = await addSubscriberToMailchimp(email, mockPayload);

  expect(result).toBe(true);
  expect(mailchimp.lists.addListMember).toHaveBeenCalledWith('test-list-id', {
    email_address: email,
    status: 'pending',
  });
});

test('should handle missing Mailchimp list ID', async () => {
  // Temporarily remove the list ID
  process.env.YUZZI_MAILCHIMP_LIST_ID = '';

  await expect(addSubscriberToMailchimp('test@example.com', mockPayload)).rejects.toThrow(
    'YUZZI_MAILCHIMP_LIST_ID is not defined'
  );
});

test('should handle existing subscriber error', async () => {
  const mockError: MailchimpErrorResponse = {
    response: {
      body: {
        title: 'Member Exists',
      },
    },
  };

  (mailchimp.lists.addListMember as jest.Mock).mockRejectedValueOnce(mockError);

  await expect(addSubscriberToMailchimp('test@example.com', mockPayload)).rejects.toThrow(
    'This email address is already subscribed to our newsletter.'
  );
});

test('should handle invalid email format error', async () => {
  const mockError: MailchimpErrorResponse = {
    response: {
      body: {
        title: 'Invalid Resource',
      },
    },
  };

  (mailchimp.lists.addListMember as jest.Mock).mockRejectedValueOnce(mockError);

  await expect(addSubscriberToMailchimp('invalid-email', mockPayload)).rejects.toThrow(
    'Invalid email address format.'
  );
});

test('should handle authentication error', async () => {
  const mockError: MailchimpErrorResponse = {
    response: {
      status: 401,
    },
  };

  (mailchimp.lists.addListMember as jest.Mock).mockRejectedValueOnce(mockError);

  await expect(addSubscriberToMailchimp('test@example.com', mockPayload)).rejects.toThrow(
    'Mailchimp API authentication failed. Please contact support.'
  );
});

test('should handle list not found error', async () => {
  const mockError: MailchimpErrorResponse = {
    response: {
      status: 404,
    },
  };

  (mailchimp.lists.addListMember as jest.Mock).mockRejectedValueOnce(mockError);

  await expect(addSubscriberToMailchimp('test@example.com', mockPayload)).rejects.toThrow(
    'Newsletter list not found. Please contact support.'
  );
});

test('should handle generic error', async () => {
  const mockError = new Error('Generic error') as MailchimpError;

  (mailchimp.lists.addListMember as jest.Mock).mockRejectedValueOnce(mockError);

  await expect(addSubscriberToMailchimp('test@example.com', mockPayload)).rejects.toThrow(
    'Failed to add subscriber to newsletter. Please try again later.'
  );
});
