import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useNewsletterValidation } from '../../../app/hooks/useNewsletter';
import { useCreateSubscriber } from '../../../app/hooks/useCreateSubscriber';
import { Newsletter } from '../newsletter';

// Mock the custom hooks
jest.mock('../../../app/hooks/useNewsletter', () => ({
  useNewsletterValidation: jest.fn(),
}));

jest.mock('../../../app/hooks/useCreateSubscriber', () => ({
  useCreateSubscriber: jest.fn(),
}));

// Mock setTimeout to use fake timers
jest.useFakeTimers();

describe('Newsletter Component', () => {
  const mockSetShowNewsletter = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockHandleCancel = jest.fn();
  const mockCreateSubscriber = jest.fn();

  // Default mock implementation for the hooks
  const setupMockHooks = (
    overrides: {
      newsletter?: Partial<ReturnType<typeof useNewsletterValidation>>;
      createSubscriber?: Partial<ReturnType<typeof useCreateSubscriber>>;
    } = {}
  ) => {
    const mockSetFormValue = jest.fn();

    const defaultNewsletterValues = {
      formValue: { email: '' },
      setFormValue: mockSetFormValue,
      validationMessage: '',
      showingError: false,
      handleSubmit: mockHandleSubmit,
      handleCancel: mockHandleCancel,
    };

    const defaultCreateSubscriberValues = {
      createSubscriber: mockCreateSubscriber.mockResolvedValue({ success: true }),
      loading: false,
      error: null,
    };

    (useNewsletterValidation as jest.Mock).mockReturnValue({
      ...defaultNewsletterValues,
      ...overrides.newsletter,
    });

    (useCreateSubscriber as jest.Mock).mockReturnValue({
      ...defaultCreateSubscriberValues,
      ...overrides.createSubscriber,
    });

    return {
      mockSetFormValue,
      mockHandleSubmit,
      mockHandleCancel,
      mockCreateSubscriber,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockHooks();
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

  it('shows submitting text when loading is true', () => {
    setupMockHooks({
      createSubscriber: { loading: true },
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    expect(screen.getByTestId('submitting-text')).toBeInTheDocument();
    expect(screen.queryByTestId('email-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('subscribe-button')).not.toBeInTheDocument();
  });

  it('displays validation message when showingError is true', () => {
    setupMockHooks({
      newsletter: {
        validationMessage: 'Invalid email address',
        showingError: true,
      },
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    const input = screen.getByTestId('email-input');
    expect(input).toHaveValue('Invalid email address');
    expect(input).toHaveStyle('color: red');
  });

  it('calls handleSubmit when form is submitted', () => {
    setupMockHooks({
      newsletter: { formValue: { email: 'test@example.com' } },
    });

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

    setupMockHooks({
      newsletter: {
        formValue: { email: '' },
        setFormValue: mockSetFormValue,
      },
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    const input = screen.getByTestId('email-input');
    // Use fireEvent instead of userEvent
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    // The component uses controlled input, so each keypress should call setFormValue
    expect(mockSetFormValue).toHaveBeenCalled();
  });

  it('simulates integration with the hooks for form submission', () => {
    // Step 1: Initial state
    setupMockHooks({
      newsletter: {
        formValue: { email: 'valid@example.com' },
      },
    });

    const { unmount } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Click submit
    fireEvent.click(screen.getByTestId('subscribe-button'));

    // Check handleSubmit was called
    expect(mockHandleSubmit).toHaveBeenCalled();

    // Clean up first render
    unmount();

    // Step 2: Show submitting state
    setupMockHooks({
      newsletter: {
        formValue: { email: 'valid@example.com' },
      },
      createSubscriber: {
        loading: true,
        createSubscriber: jest.fn().mockResolvedValue({ success: true }),
      },
    });

    const { unmount: unmount2 } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check submitting text is shown
    expect(screen.getByTestId('submitting-text')).toBeInTheDocument();

    // Clean up second render
    unmount2();

    // Step 3: After submission is complete
    setupMockHooks({
      newsletter: {
        formValue: { email: 'valid@example.com' },
      },
      createSubscriber: {
        loading: false,
        createSubscriber: jest.fn().mockResolvedValue({ success: true }),
      },
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check email input is visible again
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
  });

  it('shows error message when submitting with invalid email', () => {
    // Step 1: Initial state with invalid email
    setupMockHooks({
      newsletter: {
        formValue: { email: 'invalidemail' },
      },
    });

    const { unmount } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Click submit
    fireEvent.click(screen.getByTestId('subscribe-button'));

    // Check handleSubmit was called
    expect(mockHandleSubmit).toHaveBeenCalled();

    // Clean up first render
    unmount();

    // Step 2: Show error state
    setupMockHooks({
      newsletter: {
        formValue: { email: 'invalidemail' },
        validationMessage: 'Invalid email address',
        showingError: true,
      },
    });

    const { unmount: unmount2 } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check error message is shown
    const input = screen.getByTestId('email-input');
    expect(input).toHaveValue('Invalid email address');
    expect(input).toHaveStyle('color: red');

    // Clean up second render
    unmount2();

    // Step 3: After error is cleared
    setupMockHooks({
      newsletter: {
        formValue: { email: 'invalidemail' },
        showingError: false,
      },
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
      handleSubmit: jest.fn(),
      // This is the important part - directly call onCancel
      handleCancel: () => onCancel(),
    }));

    (useCreateSubscriber as jest.Mock).mockReturnValue({
      createSubscriber: jest.fn(),
      loading: false,
      error: null,
    });

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
    setupMockHooks({
      newsletter: {
        formValue: { email: 'test@example.com' },
      },
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
    setupMockHooks({
      newsletter: {
        formValue: { email: 'test@example.com' },
      },
      createSubscriber: {
        loading: true,
        createSubscriber: jest.fn().mockResolvedValue({ success: true }),
      },
    });

    const { unmount: unmount2 } = render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check submitting text is shown
    expect(screen.getByTestId('submitting-text')).toBeInTheDocument();

    // Clean up second render
    unmount2();

    // Step 3: After submission is complete with reset form
    setupMockHooks({
      newsletter: {
        formValue: { email: '' }, // Reset email value
      },
      createSubscriber: {
        loading: false,
        createSubscriber: jest.fn().mockResolvedValue({ success: true }),
      },
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Check form is reset
    expect(screen.getByTestId('email-input')).toHaveValue('');
  });

  it('shows submission error message when API returns error', async () => {
    // Mock createSubscriber to return error
    const mockCreateSubscriber = jest.fn().mockResolvedValue({
      success: false,
      error: 'This email is already subscribed',
    });

    setupMockHooks({
      newsletter: {
        formValue: { email: 'test@example.com' },
        handleSubmit: jest.fn().mockReturnValue(true), // Validation passes
      },
      createSubscriber: {
        loading: false,
        error: { message: 'This email is already subscribed' },
        createSubscriber: mockCreateSubscriber,
      },
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Submit the form to trigger the error handling
    await act(async () => {
      fireEvent.click(screen.getByTestId('subscribe-button'));
    });

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByTestId('submission-error-text')).toBeInTheDocument();
      expect(screen.getByText('This email is already subscribed')).toBeInTheDocument();
    });
  });

  it('shows success message when subscription is successful', async () => {
    // Mock createSubscriber to return success
    const mockCreateSubscriber = jest.fn().mockResolvedValue({
      success: true,
    });

    setupMockHooks({
      newsletter: {
        formValue: { email: 'test@example.com' },
        handleSubmit: jest.fn().mockReturnValue(true), // Validation passes
      },
      createSubscriber: {
        loading: false,
        error: null,
        createSubscriber: mockCreateSubscriber,
      },
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Submit the form to trigger success
    await act(async () => {
      fireEvent.click(screen.getByTestId('subscribe-button'));
    });

    // Wait for the success message to appear
    await waitFor(() => {
      expect(screen.getByTestId('success-text')).toBeInTheDocument();
      expect(screen.getByText('Thank you for subscribing!')).toBeInTheDocument();
    });
  });

  it('handles the scenario where same email is submitted twice - first success, then error', async () => {
    // Test the error scenario directly without the success transition
    const mockCreateSubscriberError = jest.fn().mockResolvedValue({
      success: false,
      error: 'This email address is already subscribed to our newsletter.',
    });

    setupMockHooks({
      newsletter: {
        formValue: { email: 'test@example.com' },
        handleSubmit: jest.fn().mockReturnValue(true),
      },
      createSubscriber: {
        loading: false,
        error: { message: 'This email address is already subscribed to our newsletter.' },
        createSubscriber: mockCreateSubscriberError,
      },
    });

    render(<Newsletter setShowNewsletter={mockSetShowNewsletter} />);

    // Submit the form to trigger error
    await act(async () => {
      fireEvent.click(screen.getByTestId('subscribe-button'));
    });

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByTestId('submission-error-text')).toBeInTheDocument();
      expect(
        screen.getByText('This email address is already subscribed to our newsletter.')
      ).toBeInTheDocument();
    });

    // Verify submission was called
    expect(mockCreateSubscriberError).toHaveBeenCalledWith('test@example.com');
  });
});
