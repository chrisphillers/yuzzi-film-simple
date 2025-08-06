import { render, screen, fireEvent } from '@testing-library/react';
import { useNewsletterValidation } from '../useNewsletter';
import { useCreateSubscriber } from '../useCreateSubscriber';
import { Newsletter } from '../../../components/newsletter/newsletter';

// Mock both hooks
jest.mock('../useNewsletter', () => ({
  useNewsletterValidation: jest.fn(),
}));

jest.mock('../useCreateSubscriber', () => ({
  useCreateSubscriber: jest.fn(),
}));

// Mock setTimeout to use fake timers
jest.useFakeTimers();

describe('Newsletter Modal', () => {
  const mockSetShowNewsletter = jest.fn();
  let originalConsoleLog: typeof console.log;

  beforeEach(() => {
    jest.clearAllMocks();

    // Save original console.log
    originalConsoleLog = console.log;
    // Replace with silent mock
    console.log = jest.fn();

    // Default mock implementation for both hooks
    (useNewsletterValidation as jest.Mock).mockReturnValue({
      formValue: { email: '' },
      setFormValue: jest.fn(),
      validationMessage: '',
      showingError: false,
      handleSubmit: jest.fn(),
      handleCancel: jest.fn(),
    });

    (useCreateSubscriber as jest.Mock).mockReturnValue({
      createSubscriber: jest.fn().mockResolvedValue({ success: true }),
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    // Restore original console.log
    console.log = originalConsoleLog;
  });

  test('renders the newsletter form with all elements', () => {
    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check for brand text
    expect(screen.getByText('YUZZI')).toBeInTheDocument();

    // Check for input field
    expect(screen.getByTestId('email-input')).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByText('SUBSCRIBE')).toBeInTheDocument();
    expect(screen.getByText('CANCEL')).toBeInTheDocument();
  });

  test('shows error when submitting without an email', () => {
    // Setup with validation error
    const mockHandleSubmit = jest.fn();
    (useNewsletterValidation as jest.Mock).mockReturnValue({
      formValue: { email: '' },
      setFormValue: jest.fn(),
      validationMessage: '',
      showingError: false,
      handleSubmit: mockHandleSubmit,
      handleCancel: jest.fn(),
    });

    const { unmount } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Submit form without entering an email
    fireEvent.click(screen.getByText('SUBSCRIBE'));

    expect(mockHandleSubmit).toHaveBeenCalled();

    // Cleanup
    unmount();

    // Setup with error state
    (useNewsletterValidation as jest.Mock).mockReturnValue({
      formValue: { email: '' },
      setFormValue: jest.fn(),
      validationMessage: 'Email is required',
      showingError: true,
      handleSubmit: jest.fn(),
      handleCancel: jest.fn(),
    });

    const { unmount: unmount2 } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check that error message is shown
    expect(screen.getByTestId('email-input')).toHaveValue('Email is required');
    expect(screen.getByTestId('email-input')).toHaveStyle('color: red');

    // Cleanup
    unmount2();

    // Setup with error cleared
    (useNewsletterValidation as jest.Mock).mockReturnValue({
      formValue: { email: '' },
      setFormValue: jest.fn(),
      validationMessage: '',
      showingError: false,
      handleSubmit: jest.fn(),
      handleCancel: jest.fn(),
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Error message should be gone
    expect(screen.getByTestId('email-input')).not.toHaveValue('Email is required');
    expect(screen.getByTestId('email-input')).not.toHaveStyle('color: red');
  });

  test('shows error for invalid email format', () => {
    // Setup with initial state
    const mockSetFormValue = jest.fn();
    const mockHandleSubmit = jest.fn();
    (useNewsletterValidation as jest.Mock).mockReturnValue({
      formValue: { email: 'invalid@' },
      setFormValue: mockSetFormValue,
      validationMessage: '',
      showingError: false,
      handleSubmit: mockHandleSubmit,
      handleCancel: jest.fn(),
    });

    const { unmount } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Submit form with invalid email
    fireEvent.click(screen.getByText('SUBSCRIBE'));

    expect(mockHandleSubmit).toHaveBeenCalled();

    // Cleanup
    unmount();

    // Setup with error state
    (useNewsletterValidation as jest.Mock).mockReturnValue({
      formValue: { email: 'invalid@' },
      setFormValue: jest.fn(),
      validationMessage: 'Please enter a valid email address',
      showingError: true,
      handleSubmit: jest.fn(),
      handleCancel: jest.fn(),
    });

    const { unmount: unmount2 } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check that error message is shown
    expect(screen.getByTestId('email-input')).toHaveValue('Please enter a valid email address');
    expect(screen.getByTestId('email-input')).toHaveStyle('color: red');

    // Cleanup
    unmount2();

    // Setup with error cleared
    (useNewsletterValidation as jest.Mock).mockReturnValue({
      formValue: { email: 'invalid@' },
      setFormValue: jest.fn(),
      validationMessage: '',
      showingError: false,
      handleSubmit: jest.fn(),
      handleCancel: jest.fn(),
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Input should return to original value
    expect(screen.getByTestId('email-input')).toHaveValue('invalid@');
    expect(screen.getByTestId('email-input')).not.toHaveStyle('color: red');
  });

  test('shows "Submitting..." when submitting with valid email', () => {
    // Setup with initial state
    const mockHandleSubmit = jest.fn();
    (useNewsletterValidation as jest.Mock).mockReturnValue({
      formValue: { email: 'valid@example.com' },
      setFormValue: jest.fn(),
      validationMessage: '',
      showingError: false,
      handleSubmit: mockHandleSubmit,
      handleCancel: jest.fn(),
    });

    const { unmount } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Submit form with valid email
    fireEvent.click(screen.getByText('SUBSCRIBE'));

    expect(mockHandleSubmit).toHaveBeenCalled();

    // Cleanup
    unmount();

    // Setup with submitting state - loading comes from useCreateSubscriber
    (useCreateSubscriber as jest.Mock).mockReturnValue({
      createSubscriber: jest.fn(),
      loading: true,
      error: null,
    });

    const { unmount: unmount2 } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check that "Submitting..." is shown
    expect(screen.getByTestId('submitting-text')).toBeInTheDocument();
    expect(screen.getByText('Submitting...')).toBeInTheDocument();

    // Input and subscribe button should not be visible
    expect(screen.queryByTestId('email-input')).not.toBeInTheDocument();
    expect(screen.queryByText('SUBSCRIBE')).not.toBeInTheDocument();

    // Cleanup
    unmount2();

    // Setup with completed state
    (useCreateSubscriber as jest.Mock).mockReturnValue({
      createSubscriber: jest.fn(),
      loading: false,
      error: null,
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Form should return to normal state
    expect(screen.queryByText('Submitting...')).not.toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByText('SUBSCRIBE')).toBeInTheDocument();
  });

  test('clears input when clicking CANCEL', () => {
    // Setup with initial state
    const mockHandleCancel = jest.fn();
    (useNewsletterValidation as jest.Mock).mockReturnValue({
      formValue: { email: 'test@example.com' },
      setFormValue: jest.fn(),
      validationMessage: '',
      showingError: false,
      handleSubmit: jest.fn(),
      handleCancel: mockHandleCancel,
    });

    const { unmount } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Verify value is in the input
    expect(screen.getByTestId('email-input')).toHaveValue('test@example.com');

    // Click cancel
    fireEvent.click(screen.getByText('CANCEL'));

    expect(mockHandleCancel).toHaveBeenCalled();

    // Cleanup
    unmount();

    // Setup with cleared state
    (useNewsletterValidation as jest.Mock).mockReturnValue({
      formValue: { email: '' },
      setFormValue: jest.fn(),
      validationMessage: '',
      showingError: false,
      handleSubmit: jest.fn(),
      handleCancel: jest.fn(),
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check that input is cleared
    expect(screen.getByTestId('email-input')).toHaveValue('');
  });

  test('logs submission with valid email', () => {
    // Setup mock that will call console.log
    const mockHandleSubmit = jest.fn(({ value }) => {
      console.log('Submit', value);
    });

    (useNewsletterValidation as jest.Mock).mockReturnValue({
      formValue: { email: 'valid@example.com' },
      setFormValue: jest.fn(),
      validationMessage: '',
      showingError: false,
      handleSubmit: mockHandleSubmit,
      handleCancel: jest.fn(),
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Submit form
    fireEvent.click(screen.getByText('SUBSCRIBE'));

    // Check console.log was called with form value
    expect(console.log).toHaveBeenCalledWith('Submit', { email: 'valid@example.com' });
  });

  test('handles brand link click correctly', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    fireEvent.click(screen.getByTestId('brand-link'));

    expect(alertMock).toHaveBeenCalledWith('click');

    alertMock.mockRestore();
  });

  test('preserves form position and prevents style jumping', () => {
    // Setup with initial state
    const mockHandleSubmit = jest.fn();
    (useNewsletterValidation as jest.Mock).mockReturnValue({
      formValue: { email: 'valid@example.com' },
      setFormValue: jest.fn(),
      validationMessage: '',
      showingError: false,
      handleSubmit: mockHandleSubmit,
      handleCancel: jest.fn(),
    });

    const { container, unmount } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Get initial position of the component
    const formContainer = container.firstChild as HTMLElement;
    if (!formContainer) {
      throw new Error('Form container not found');
    }

    const initialHeight = formContainer.clientHeight;

    // Submit form
    fireEvent.click(screen.getByText('SUBSCRIBE'));

    expect(mockHandleSubmit).toHaveBeenCalled();

    // Cleanup
    unmount();

    // Setup with submitting state - loading comes from useCreateSubscriber
    (useCreateSubscriber as jest.Mock).mockReturnValue({
      createSubscriber: jest.fn(),
      loading: true,
      error: null,
    });

    const { container: container2, unmount: unmount2 } = render(
      <Newsletter setShowNewsletter={mockSetShowNewsletter} />
    );

    // Check position after submitting
    const submittingContainer = container2.firstChild as HTMLElement;
    if (!submittingContainer) {
      throw new Error('Submitting container not found');
    }

    const submittingHeight = submittingContainer.clientHeight;

    // Height should be maintained
    expect(submittingHeight).toBe(initialHeight);

    // Cleanup
    unmount2();

    // Setup with completed state
    (useCreateSubscriber as jest.Mock).mockReturnValue({
      createSubscriber: jest.fn(),
      loading: false,
      error: null,
    });

    const { container: container3 } = render(
      <Newsletter setShowNewsletter={mockSetShowNewsletter} />
    );

    // Check position after returning to normal state
    const finalContainer = container3.firstChild as HTMLElement;
    if (!finalContainer) {
      throw new Error('Final container not found');
    }

    const finalHeight = finalContainer.clientHeight;

    // Height should be maintained
    expect(finalHeight).toBe(initialHeight);
  });
});
