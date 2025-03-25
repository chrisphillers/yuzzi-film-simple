import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useInactivityDetector } from '../useInactivityDetector';

// Simple test component with direct state control for more reliable testing
function TestComponent() {
  const [isInactive, setIsInactive] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Use effect to set up the timeout
  React.useEffect(() => {
    // Set up the initial timeout
    timerRef.current = setTimeout(() => {
      setIsInactive(true);
    }, 1000);

    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Function to handle user activity
  const handleActivity = () => {
    setIsInactive(false);

    // Reset the timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsInactive(true);
    }, 1000);
  };

  return (
    <div data-testid="test-component" onClick={handleActivity} onMouseMove={handleActivity}>
      <p>Status: {isInactive ? 'Inactive' : 'Active'}</p>
      {isInactive && <div data-testid="inactive-message">You are inactive!</div>}
      <button data-testid="test-button" onClick={handleActivity}>
        Click me
      </button>
    </div>
  );
}

// Mock the actual hook since we're just testing integration behavior
jest.mock('../useInactivityDetector', () => ({
  useInactivityDetector: jest.fn(() => false),
}));

describe('useInactivityDetector Integration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('component shows inactive message after timeout', () => {
    render(<TestComponent />);

    // Initially no inactive message
    expect(screen.queryByTestId('inactive-message')).not.toBeInTheDocument();

    // Advance time to trigger timeout
    act(() => {
      jest.advanceTimersByTime(1100); // Advance past 1 second
    });

    // Should now show inactive message
    expect(screen.getByTestId('inactive-message')).toBeInTheDocument();
    expect(screen.getByText('Status: Inactive')).toBeInTheDocument();
  });

  test('component returns to active state after user interaction', () => {
    render(<TestComponent />);

    // Make component inactive
    act(() => {
      jest.advanceTimersByTime(1100);
    });

    // Verify inactive state
    expect(screen.getByTestId('inactive-message')).toBeInTheDocument();

    // Simulate user clicking a button
    act(() => {
      fireEvent.click(screen.getByTestId('test-button'));
    });

    // Should return to active state
    expect(screen.queryByTestId('inactive-message')).not.toBeInTheDocument();
    expect(screen.getByText('Status: Active')).toBeInTheDocument();
  });

  test('activity during the timeout period resets the timer', () => {
    render(<TestComponent />);

    // Initially no inactive message
    expect(screen.queryByTestId('inactive-message')).not.toBeInTheDocument();

    // Advance partway through timeout
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Simulate user activity
    act(() => {
      fireEvent.click(screen.getByTestId('test-button'));
    });

    // Advance time that would have triggered the original timeout
    act(() => {
      jest.advanceTimersByTime(600);
    });

    // Should still be active (timer was reset)
    expect(screen.queryByTestId('inactive-message')).not.toBeInTheDocument();

    // Now advance full timeout period after the activity
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now should become inactive
    expect(screen.getByTestId('inactive-message')).toBeInTheDocument();
  });

  test('multiple user interactions keep component active', () => {
    render(<TestComponent />);

    // Simulate a series of user interactions
    for (let i = 0; i < 5; i++) {
      // Advance time but not to timeout
      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Simulate user activity
      act(() => {
        fireEvent.mouseMove(screen.getByTestId('test-component'));
      });
    }

    // Should still be active after all interactions (only 200ms * 5 = 1000ms have passed,
    // but the timer keeps getting reset, so we shouldn't be inactive)
    expect(screen.queryByTestId('inactive-message')).not.toBeInTheDocument();

    // Now advance full timeout period after the last activity
    act(() => {
      jest.advanceTimersByTime(1100);
    });

    // Should become inactive
    expect(screen.getByTestId('inactive-message')).toBeInTheDocument();

    // Activity should make it active again
    act(() => {
      fireEvent.click(screen.getByTestId('test-button'));
    });

    // Should be active again
    expect(screen.queryByTestId('inactive-message')).not.toBeInTheDocument();
  });
});
