import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { NewsletterModal } from '../newsletter';

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

// Mock setTimeout to use fake timers
jest.useFakeTimers();

//TODO - fix tests adding state
describe.skip('NewsletterModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the newsletter form with all elements', () => {
    render(<NewsletterModal />);

    // Check for brand text
    expect(screen.getByText('LE YUZZI')).toBeInTheDocument();

    // Check for input field
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByText('SUBSCRIBE')).toBeInTheDocument();
    expect(screen.getByText('CANCEL')).toBeInTheDocument();
  });

  test('shows error when submitting without an email', async () => {
    render(<NewsletterModal />);

    // Submit form without entering an email
    await act(async () => {
      const subscribeButton = screen.getByText('SUBSCRIBE');
      fireEvent.click(subscribeButton);
    });

    // Check that error message is shown
    expect(screen.getByDisplayValue('Email is required')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Email is required')).toHaveStyle('color: red');

    // Advance timers to clear error message
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    // Error message should be gone
    await waitFor(() => {
      expect(screen.queryByDisplayValue('Email is required')).not.toBeInTheDocument();
    });
  });

  test('shows error for invalid email format', async () => {
    render(<NewsletterModal />);

    // Enter invalid email
    await act(async () => {
      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'invalid@' } });
    });

    // Submit form
    await act(async () => {
      const subscribeButton = screen.getByText('SUBSCRIBE');
      fireEvent.click(subscribeButton);
    });

    // Check that error message is shown
    expect(screen.getByDisplayValue('Please enter a valid email address')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Please enter a valid email address')).toHaveStyle(
      'color: red'
    );

    // Advance timers to clear error message
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    // Input should return to original value
    await waitFor(() => {
      expect(screen.getByDisplayValue('invalid@')).toBeInTheDocument();
    });
  });

  test('shows "Submitting..." when submitting with valid email', async () => {
    render(<NewsletterModal />);

    // Enter valid email
    await act(async () => {
      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    });

    // Submit form
    await act(async () => {
      const subscribeButton = screen.getByText('SUBSCRIBE');
      fireEvent.click(subscribeButton);
    });

    // Check that "Submitting..." is shown
    expect(screen.getByText('Submitting...')).toBeInTheDocument();

    // Input and subscribe button should not be visible
    expect(screen.queryByPlaceholderText('Email')).not.toBeInTheDocument();
    expect(screen.queryByText('SUBSCRIBE')).not.toBeInTheDocument();

    // Advance timers to complete submission
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    // Form should return to normal state
    await waitFor(() => {
      expect(screen.queryByText('Submitting...')).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByText('SUBSCRIBE')).toBeInTheDocument();
    });
  });

  test('clears input when clicking CANCEL', async () => {
    render(<NewsletterModal />);

    // Enter email
    await act(async () => {
      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    });

    // Verify value is in the input
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();

    // Click cancel
    await act(async () => {
      const cancelButton = screen.getByText('CANCEL');
      fireEvent.click(cancelButton);
    });

    // Check that input is cleared
    expect(screen.getByPlaceholderText('Email')).toHaveValue('');
  });

  test('logs submission with valid email', async () => {
    // Spy on console.log
    const consoleSpy = jest.spyOn(console, 'log');

    render(<NewsletterModal />);

    // Enter valid email
    await act(async () => {
      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    });

    // Submit form
    await act(async () => {
      const subscribeButton = screen.getByText('SUBSCRIBE');
      fireEvent.click(subscribeButton);
    });

    // Check console.log was called with form value
    expect(consoleSpy).toHaveBeenCalledWith('Submit', { email: 'valid@example.com' });

    // Clean up
    consoleSpy.mockRestore();
  });

  test('preserves form position and prevents style jumping', async () => {
    const { container } = render(<NewsletterModal />);

    // Get initial position of the component
    const formContainer = container.firstChild as HTMLElement;
    if (!formContainer) {
      throw new Error('Form container not found');
    }
    const initialRect = formContainer.getBoundingClientRect();

    // Enter valid email and submit
    await act(async () => {
      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    });

    await act(async () => {
      const subscribeButton = screen.getByText('SUBSCRIBE');
      fireEvent.click(subscribeButton);
    });

    // Check position after submitting
    const submittingRect = formContainer.getBoundingClientRect();

    // Position should be maintained (top shouldn't change)
    expect(submittingRect.top).toBe(initialRect.top);
    expect(submittingRect.height).toBe(initialRect.height);

    // Advance timers to complete submission
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      // Check position after returning to normal state
      const finalRect = formContainer.getBoundingClientRect();
      expect(finalRect.top).toBe(initialRect.top);
      expect(finalRect.height).toBe(initialRect.height);
    });
  });
});
