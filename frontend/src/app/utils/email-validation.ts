//  Validates an email address for format and security

export const validateEmail = (email: string): string | undefined => {
  // Check if email exists
  if (!email || email.length === 0) {
    return 'Email is required';
  }

  // Check email length (RFC 5321 compliant)
  if (email.length > 254) {
    return 'Email is too long';
  }

  // Check for script injection attempts
  if (/<script|javascript:|data:|onclick|onerror|alert\(|eval\(|document\.|window\./i.test(email)) {
    return 'Invalid email content';
  }

  // Basic structure check - must have exactly one @, with content before and after
  const atIndex = email.indexOf('@');
  if (
    atIndex === -1 ||
    atIndex !== email.lastIndexOf('@') ||
    atIndex === 0 ||
    atIndex === email.length - 1
  ) {
    return 'Please enter a valid email address';
  }

  // Split into local and domain parts
  const localPart = email.slice(0, atIndex);
  const domainPart = email.slice(atIndex + 1);

  // Check for basic formatting issues
  if (
    email.includes(' ') ||
    email.includes('..') ||
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    domainPart.startsWith('.') ||
    domainPart.endsWith('.') ||
    !domainPart.includes('.')
  ) {
    return 'Please enter a valid email address';
  }

  // For valid email format with TLD
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  // Only check against regex if we haven't already found an issue
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  // Email is valid
  return undefined;
};

//  Returns an array of validation functions for use with Grommet's FormField

export const getEmailValidators = () => [validateEmail];
