import { renderHook, act } from '@testing-library/react';
import { useInactivityDetector } from '../useInactivityDetector';

describe('useInactivityDetector', () => {
  // Setup and teardown for each test
  beforeEach(() => {
    // Mock setTimeout and clearTimeout
    jest.useFakeTimers();

    // Mock the window event listeners
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();

    // Spy on console.log instead of mocking it completely
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('should initialize as active (not inactive)', () => {
    const { result } = renderHook(() => useInactivityDetector());

    expect(result.current).toBe(false);
  });

  test('should register event listeners on mount', () => {
    renderHook(() => useInactivityDetector());

    // Check that event listeners were added for all events
    const expectedEvents = ['mousedown', 'mousemove', 'click', 'keydown', 'touchstart'];

    expectedEvents.forEach((eventType) => {
      expect(window.addEventListener).toHaveBeenCalledWith(
        eventType,
        expect.any(Function),
        expect.objectContaining({
          capture: true,
          passive: true,
        })
      );
    });

    // Should register listeners for each event
    expect(window.addEventListener).toHaveBeenCalledTimes(expectedEvents.length);
  });

  test('should set inactive to true after timeout period', () => {
    const { result } = renderHook(() => useInactivityDetector(1000)); // 1 second timeout for test

    // Initially active
    expect(result.current).toBe(false);

    // Fast-forward time past the first poll check
    act(() => {
      jest.advanceTimersByTime(1100);
    });

    // Should now be inactive after the poll interval runs
    expect(result.current).toBe(true);
  });

  test('should use custom timeout if provided', () => {
    // Just make sure it renders without errors
    const customTimeout = 5000; // 5 seconds
    renderHook(() => useInactivityDetector(customTimeout));
  });

  test('should remove event listeners on unmount', () => {
    const { unmount } = renderHook(() => useInactivityDetector());

    // Unmount the component
    unmount();

    // Check that event listeners were removed
    const expectedEvents = ['mousedown', 'mousemove', 'click', 'keydown', 'touchstart'];

    expectedEvents.forEach((eventType) => {
      expect(window.removeEventListener).toHaveBeenCalledWith(
        eventType,
        expect.any(Function),
        expect.objectContaining({ capture: true })
      );
    });

    // Should remove listeners for each event
    expect(window.removeEventListener).toHaveBeenCalledTimes(expectedEvents.length);
  });

  test('should clear timers on unmount', () => {
    // Mock clearInterval
    const originalClearInterval = global.clearInterval;
    global.clearInterval = jest.fn();

    try {
      const { unmount } = renderHook(() => useInactivityDetector());

      // Reset mocks to focus on unmount behavior
      jest.clearAllMocks();

      // Unmount the component
      unmount();

      // Should clear the interval
      expect(global.clearInterval).toHaveBeenCalled();
    } finally {
      global.clearInterval = originalClearInterval;
    }
  });
});
