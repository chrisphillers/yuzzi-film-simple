import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useMediaRemote } from '@vidstack/react';

// Mock styled-components to avoid the .attrs issue
jest.mock('styled-components', () => {
  // Return a simple factory function for each component type
  const createStyledComponent = (tag: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const StyledComponent = (_: TemplateStringsArray) => {
      // Return a component that renders the tag with the same props
      const Component = (props: React.HTMLAttributes<HTMLElement>) => {
        const Tag = tag as keyof JSX.IntrinsicElements;
        return <Tag {...props} />;
      };
      // Add display name
      Component.displayName = `Styled(${tag})`;
      return Component;
    };
    return StyledComponent;
  };

  return {
    div: createStyledComponent('div'),
    button: createStyledComponent('button'),
    span: createStyledComponent('span'),
  };
});

// Mocks - more minimal to avoid styled-components issues
jest.mock('@vidstack/react', () => {
  const mockRemote = {
    togglePaused: jest.fn(),
    toggleCaptions: jest.fn(),
    toggleFullscreen: jest.fn(),
    seek: jest.fn(),
  };

  return {
    MediaPlayer: jest.fn(({ children, ...props }) => (
      <div data-testid="media-player" {...props}>
        {children}
      </div>
    )),
    MediaProvider: jest.fn(({ children }) => <div data-testid="media-provider">{children}</div>),
    useMediaState: jest.fn((state) => {
      if (state === 'paused') return false;
      if (state === 'fullscreen') return false;
      if (state === 'textTrack') return false;
      if (state === 'currentTime') return 60;
      if (state === 'duration') return 180;
      return 0;
    }),
    useMediaRemote: jest.fn(() => mockRemote),
  };
});

// Mock Grommet icons
jest.mock('grommet-icons', () => ({
  Close: () => <div data-testid="close-icon">X</div>,
  Play: () => <div data-testid="play-icon">Play</div>,
  Pause: () => <div data-testid="pause-icon">Pause</div>,
  ClosedCaption: () => <div data-testid="cc-icon">CC</div>,
  Expand: () => <div data-testid="expand-icon">Expand</div>,
}));

// Import after all mocks are set up
import { VideoStackPlayer, Controls, formatTime } from '../ui/videomodal';

describe('VideoStackPlayer', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('formats time correctly', () => {
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(3661)).toBe('61:01');
    expect(formatTime(NaN)).toBe('00:00');
  });

  test('renders the media player with correct props', () => {
    render(<VideoStackPlayer videoID={123456} onClose={mockOnClose} />);

    const player = screen.getByTestId('media-player');
    expect(player).toBeInTheDocument();
    expect(player).toHaveStyle({ width: '100%', height: '100%' });
  });

  test('handles ESC key press to close', () => {
    render(<VideoStackPlayer videoID={123456} onClose={mockOnClose} />);

    // Simulate ESC key press
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });

  // Test component mounting/unmounting cleanup
  test('cleans up event listeners on unmount', () => {
    const { unmount } = render(<VideoStackPlayer videoID={123456} onClose={mockOnClose} />);

    // Spy on window.removeEventListener
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    // Unmount the component
    unmount();

    // Check if removeEventListener was called
    expect(removeEventListenerSpy).toHaveBeenCalled();

    // Clean up the spy
    removeEventListenerSpy.mockRestore();
  });
});

// Test Controls separately with its own mock remote
describe('Controls component', () => {
  const mockOnClose = jest.fn();
  const mockRemote = {
    togglePaused: jest.fn(),
    toggleCaptions: jest.fn(),
    toggleFullscreen: jest.fn(),
    seek: jest.fn(),
  };

  // Mock useMediaRemote to return our mock
  beforeEach(() => {
    jest.clearAllMocks();
    // Use the imported mocked function
    (useMediaRemote as jest.Mock).mockImplementation(() => mockRemote);
  });

  test('close button calls onClose', () => {
    render(<Controls onClose={mockOnClose} />);

    const closeIcon = screen.getByTestId('close-icon');
    fireEvent.click(closeIcon);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('play button toggles play state', () => {
    render(<Controls onClose={mockOnClose} />);

    const playIcon = screen.getByTestId('pause-icon');
    fireEvent.click(playIcon);

    expect(mockRemote.togglePaused).toHaveBeenCalled();
  });

  test('captions button toggles captions', () => {
    render(<Controls onClose={mockOnClose} />);

    const ccIcon = screen.getByTestId('cc-icon');
    fireEvent.click(ccIcon);

    expect(mockRemote.toggleCaptions).toHaveBeenCalled();
  });

  test('fullscreen button toggles fullscreen', () => {
    render(<Controls onClose={mockOnClose} />);

    const expandIcon = screen.getByTestId('expand-icon');
    fireEvent.click(expandIcon);

    expect(mockRemote.toggleFullscreen).toHaveBeenCalled();
  });
});
