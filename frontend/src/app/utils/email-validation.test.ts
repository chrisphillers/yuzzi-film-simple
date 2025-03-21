import { validateEmail } from './email-validation';

describe('Email Validation', () => {
  // Valid email tests
  test('should validate correct email addresses', () => {
    const validEmails = [
      'user@example.com',
      'user.name@example.com',
      'user+tag@example.com',
      'user-name@example.com',
      'user_name@example.com',
      'user@subdomain.example.com',
      'user@example.co.uk',
      '123@example.com',
      'user@123.com',
      'user@example-domain.com',
    ];

    validEmails.forEach((email) => {
      expect(validateEmail(email)).toBeUndefined();
    });
  });

  // Required field test
  test('should fail empty emails', () => {
    expect(validateEmail('')).toBe('Email is required');
    expect(validateEmail(null)).toBe('Email is required');
    expect(validateEmail(undefined)).toBe('Email is required');
  });

  // Length tests
  test('should fail too long emails', () => {
    const longLocalPart = 'a'.repeat(255);
    const longEmail = `${longLocalPart}@example.com`;
    expect(validateEmail(longEmail)).toBe('Email is too long');
  });

  // Format tests
  test('should fail incorrectly formatted emails', () => {
    const invalidEmails = [
      'user',
      'user@',
      '@example.com',
      'user@.com',
      'user@example.',
      'user@example..com',
      'user@example@com',
      'user@exam ple.com',
      '.user@example.com',
      'user.@example.com',
      'user..name@example.com',
    ];

    invalidEmails.forEach((email) => {
      expect(validateEmail(email)).toBe('Please enter a valid email address');
    });
  });

  // Security tests
  test('should fail emails with potentially malicious content', () => {
    const maliciousEmails = [
      'user@example.com<script>alert(1)</script>',
      'javascript:alert(1)@example.com',
      'user@example.com" onclick="alert(1)',
      'user@example.com" onerror="alert(1)',
      'data:text/html,@example.com',
      'eval(alert(1))@example.com',
      'document.cookie@example.com',
      'window.location@example.com',
    ];

    maliciousEmails.forEach((email) => {
      expect(validateEmail(email)).toBe('Invalid email content');
    });
  });

  // Edge cases
  test('should handle edge cases correctly', () => {
    // Valid edge cases
    expect(validateEmail('a@b.co')).toBeUndefined();
    expect(validateEmail('disposable.style.email.with+symbol@example.com')).toBeUndefined();

    // Invalid edge cases
    expect(validateEmail('a@b')).toBe('Please enter a valid email address');
    expect(validateEmail('user@[IPv6:2001:db8:1ff::a0b:dbd0]')).toBe(
      'Please enter a valid email address'
    );
  });
});
