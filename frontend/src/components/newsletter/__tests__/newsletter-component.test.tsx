import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNewsletterValidation } from '../../../app/hooks/useNewsletter';
import { Newsletter } from '../newsletter';

// Mock the custom hook
jest.mock('../../../app/hooks/useNewsletter', () => ({
  useNewsletterValidation: jest.fn(),
}));

// Mock setTimeout to use fake timers
jest.useFakeTimers();

describe('Newsletter Component', () => {
  const mockSetShowNewsletter = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockHandleCancel = jest.fn();

  // Default mock implementation for the hook
  const setupMockHook = (overrides = {}) => {
    const mockSetFormValue = jest.fn();

    const defaultValues = {
      formValue: { email: '' },
      setFormValue: mockSetFormValue,
      validationMessage: '',
      showingError: false,
      isSubmitting: false,
      handleSubmit: mockHandleSubmit,
      handleCancel: mockHandleCancel,
    };

    (useNewsletterValidation as jest.Mock).mockReturnValue({
      ...defaultValues,
      ...overrides,
    });

    return {
      mockSetFormValue,
      mockHandleSubmit,
      mockHandleCancel,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockHook();
  });

  afterEach(() => {
    // Ensure we don't have any pending timers after each test
    jest.clearAllTimers();
  });

  it('renders the newsletter form correctly', () => {
    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check that all important elements are rendered
    expect(screen.getByTestId('brand-link')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('subscribe-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
  });

  it('shows submitting text when isSubmitting is true', () => {
    setupMockHook({ isSubmitting: true });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    expect(screen.getByTestId('submitting-text')).toBeInTheDocument();
    expect(screen.queryByTestId('email-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('subscribe-button')).not.toBeInTheDocument();
  });

  it('displays validation message when showingError is true', () => {
    setupMockHook({
      validationMessage: 'Invalid email address',
      showingError: true,
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    const input = screen.getByTestId('email-input');
    expect(input).toHaveValue('Invalid email address');
    expect(input).toHaveStyle('color: red');
  });

  it('calls handleSubmit when form is submitted', () => {
    setupMockHook({ formValue: { email: 'test@example.com' } });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Use fireEvent instead of userEvent to avoid timeout issues
    fireEvent.click(screen.getByTestId('subscribe-button'));

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('calls handleCancel when cancel button is clicked', () => {
    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Use fireEvent instead of userEvent
    fireEvent.click(screen.getByTestId('cancel-button'));

    expect(mockHandleCancel).toHaveBeenCalled();
  });

  it('updates form value when user types in email input', () => {
    const mockSetFormValue = jest.fn();

    setupMockHook({
      formValue: { email: '' },
      setFormValue: mockSetFormValue,
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    const input = screen.getByTestId('email-input');
    // Use fireEvent instead of userEvent
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    // The component uses controlled input, so each keypress should call setFormValue
    expect(mockSetFormValue).toHaveBeenCalled();
  });

  it('simulates integration with the hook for form submission', () => {
    // Step 1: Initial state
    setupMockHook({
      formValue: { email: 'valid@example.com' },
    });

    const { unmount } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Click submit
    fireEvent.click(screen.getByTestId('subscribe-button'));

    // Check handleSubmit was called
    expect(mockHandleSubmit).toHaveBeenCalled();

    // Clean up first render
    unmount();

    // Step 2: Show submitting state
    setupMockHook({
      formValue: { email: 'valid@example.com' },
      isSubmitting: true,
    });

    const { unmount: unmount2 } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check submitting text is shown
    expect(screen.getByTestId('submitting-text')).toBeInTheDocument();

    // Clean up second render
    unmount2();

    // Step 3: After submission is complete
    setupMockHook({
      formValue: { email: 'valid@example.com' },
      isSubmitting: false,
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check email input is visible again
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
  });

  it('shows error message when submitting with invalid email', () => {
    // Step 1: Initial state with invalid email
    setupMockHook({
      formValue: { email: 'invalidemail' },
    });

    const { unmount } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Click submit
    fireEvent.click(screen.getByTestId('subscribe-button'));

    // Check handleSubmit was called
    expect(mockHandleSubmit).toHaveBeenCalled();

    // Clean up first render
    unmount();

    // Step 2: Show error state
    setupMockHook({
      formValue: { email: 'invalidemail' },
      validationMessage: 'Invalid email address',
      showingError: true,
    });

    const { unmount: unmount2 } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check error message is shown
    const input = screen.getByTestId('email-input');
    expect(input).toHaveValue('Invalid email address');
    expect(input).toHaveStyle('color: red');

    // Clean up second render
    unmount2();

    // Step 3: After error is cleared
    setupMockHook({
      formValue: { email: 'invalidemail' },
      showingError: false,
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check input has original value and no error styling
    expect(screen.getByTestId('email-input')).toHaveValue('invalidemail');
    expect(screen.getByTestId('email-input')).not.toHaveStyle('color: red');
  });

  it('simulates setShowNewsletter(false) when cancel is clicked', () => {
    const setShowNewsletter = jest.fn();

    // Create a direct implementation that calls the passed function
    (useNewsletterValidation as jest.Mock).mockImplementation(({ onCancel }) => ({
      formValue: { email: '' },
      setFormValue: jest.fn(),
      validationMessage: '',
      showingError: false,
      isSubmitting: false,
      handleSubmit: jest.fn(),
      // This is the important part - directly call onCancel
      handleCancel: () => onCancel(),
    }));

    render(<Newsletter setShowNewsletter={setShowNewsletter} />);

    // Click cancel
    fireEvent.click(screen.getByTestId('cancel-button'));

    // Should call setShowNewsletter
    expect(setShowNewsletter).toHaveBeenCalledWith(false);
  });

  it('handles brand link click correctly', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    fireEvent.click(screen.getByTestId('brand-link'));

    expect(alertMock).toHaveBeenCalledWith('click');

    alertMock.mockRestore();
  });

  it('simulates form reset after successful submission', () => {
    // Step 1: Initial state with email
    setupMockHook({
      formValue: { email: 'test@example.com' },
    });

    const { unmount } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check initial value
    expect(screen.getByTestId('email-input')).toHaveValue('test@example.com');

    // Click submit
    fireEvent.click(screen.getByTestId('subscribe-button'));

    // Check handleSubmit was called
    expect(mockHandleSubmit).toHaveBeenCalled();

    // Clean up first render
    unmount();

    // Step 2: Show submitting state
    setupMockHook({
      formValue: { email: 'test@example.com' },
      isSubmitting: true,
    });

    const { unmount: unmount2 } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check submitting text is shown
    expect(screen.getByTestId('submitting-text')).toBeInTheDocument();

    // Clean up second render
    unmount2();

    // Step 3: After submission is complete with reset form
    setupMockHook({
      formValue: { email: '' }, // Reset email value
      isSubmitting: false,
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check form is reset
    expect(screen.getByTestId('email-input')).toHaveValue('');
  });
});
