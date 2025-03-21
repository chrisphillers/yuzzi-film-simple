import { renderHook, act } from '@testing-library/react';
import { useNewsletterForm } from '../useNewsletter';

// Mock the email validation module
jest.mock('../../../app/utils/email-validation', () => ({
  getEmailValidators: jest.fn(() => [
    jest.fn((email) => {
      if (!email) return 'Email is required';
      if (email === 'invalid@') return 'Please enter a valid email address';
      return undefined; // Valid email
    }),
  ]),
}));

// Mock console.log
const originalConsoleLog = console.log;
beforeEach(() => {
  console.log = jest.fn();
});
afterEach(() => {
  console.log = originalConsoleLog;
  jest.clearAllMocks();
});

// Mock timers
jest.useFakeTimers();

describe('useNewsletterForm hook', () => {
  // Mock setShowNewsletterModal function
  const mockSetShowModal = jest.fn();

  beforeEach(() => {
    // Clear mock before each test
    mockSetShowModal.mockClear();
  });

  test('initializes with empty form values', () => {
    const { result } = renderHook(() => useNewsletterForm(mockSetShowModal));

    expect(result.current.formValue).toEqual({ email: '' });
    expect(result.current.showingError).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
  });

  test('updates form value on handleChange', () => {
    const { result } = renderHook(() => useNewsletterForm(mockSetShowModal));

    act(() => {
      result.current.handleChange({
        target: { value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formValue.email).toBe('test@example.com');
  });

  test('clears form value and closes modal on handleCancel', () => {
    const { result } = renderHook(() => useNewsletterForm(mockSetShowModal));

    // Set a value first
    act(() => {
      result.current.handleChange({
        target: { value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Then cancel
    act(() => {
      result.current.handleCancel();
    });

    expect(result.current.formValue.email).toBe('');
    expect(mockSetShowModal).toHaveBeenCalledWith(false);
  });

  test('shows error message when submitting empty email', () => {
    const { result } = renderHook(() => useNewsletterForm(mockSetShowModal));

    act(() => {
      result.current.handleSubmit({ value: { email: '' } });
    });

    expect(result.current.showingError).toBe(true);
    expect(result.current.validationMessage).toBe('Email is required');
    expect(mockSetShowModal).not.toHaveBeenCalled();
  });

  test('shows error message when submitting invalid email', () => {
    const { result } = renderHook(() => useNewsletterForm(mockSetShowModal));

    act(() => {
      result.current.handleSubmit({ value: { email: 'invalid@' } });
    });

    expect(result.current.showingError).toBe(true);
    expect(result.current.validationMessage).toBe('Please enter a valid email address');
    expect(mockSetShowModal).not.toHaveBeenCalled();
  });

  test('shows submitting state when valid email is submitted', () => {
    const { result } = renderHook(() => useNewsletterForm(mockSetShowModal));

    act(() => {
      result.current.handleSubmit({ value: { email: 'valid@example.com' } });
    });

    expect(result.current.isSubmitting).toBe(true);
    expect(console.log).toHaveBeenCalledWith('Submit', { email: 'valid@example.com' });
    expect(mockSetShowModal).not.toHaveBeenCalled(); // Modal stays open during submission
  });

  test('clears error after timeout', () => {
    const { result } = renderHook(() => useNewsletterForm(mockSetShowModal));

    // Submit with invalid email
    act(() => {
      result.current.handleSubmit({ value: { email: 'invalid@' } });
    });

    // Error should be shown
    expect(result.current.showingError).toBe(true);

    // Advance timers
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Error should be cleared
    expect(result.current.showingError).toBe(false);
  });

  test('clears submitting state after timeout', () => {
    const { result } = renderHook(() => useNewsletterForm(mockSetShowModal));

    // Submit with valid email
    act(() => {
      result.current.handleSubmit({ value: { email: 'valid@example.com' } });
    });

    // Should be submitting
    expect(result.current.isSubmitting).toBe(true);

    // Advance timers
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Should no longer be submitting
    expect(result.current.isSubmitting).toBe(false);
  });

  test('keeps modal open after successful submission', () => {
    const { result } = renderHook(() => useNewsletterForm(mockSetShowModal));

    // Submit with valid email
    act(() => {
      result.current.handleSubmit({ value: { email: 'valid@example.com' } });
    });

    // Advance timers to complete submission
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Modal should still be open
    expect(mockSetShowModal).not.toHaveBeenCalled();
  });
});
