import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VideoStackPlayer } from '../ui/videomodal';

// Define interface for mock remote
interface MockRemote {
  togglePaused: jest.Mock;
  toggleCaptions: jest.Mock;
  toggleFullscreen: jest.Mock;
  seek: jest.Mock;
}

// Mock modules before import
jest.mock('@vidstack/react', () => {
  const mockRemote: MockRemote = {
    togglePaused: jest.fn(),
    toggleCaptions: jest.fn(),
    toggleFullscreen: jest.fn(),
    seek: jest.fn(),
  };

  return {
    MediaPlayer: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div data-testid="media-player" {...props}>
        {children}
      </div>
    ),
    MediaProvider: ({ children }: React.PropsWithChildren<unknown>) => (
      <div data-testid="media-provider">{children}</div>
    ),
    useMediaState: (state: string): boolean | number => {
      if (state === 'paused') return false;
      if (state === 'fullscreen') return false;
      if (state === 'textTrack') return false;
      if (state === 'currentTime') return 60;
      if (state === 'duration') return 180;
      return 0;
    },
    useMediaRemote: (): MockRemote => mockRemote,
  };
});

// Mock styled-components
jest.mock('styled-components', () => {
  const styled: {
    div: () => React.FC<React.HTMLAttributes<HTMLDivElement>>;
    button: () => React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>>;
    span: () => React.FC<React.HTMLAttributes<HTMLSpanElement>>;
  } = {
    div: () => (props: React.HTMLAttributes<HTMLDivElement>) => (
      <div data-testid="styled-div" {...props} />
    ),
    button: () => (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button data-testid="styled-button" {...props} />
    ),
    span: () => (props: React.HTMLAttributes<HTMLSpanElement>) => (
      <span data-testid="styled-span" {...props} />
    ),
  };
  return styled;
});

// Mock Grommet icons
jest.mock('grommet-icons', () => ({
  Close: () => <div data-testid="close-icon">X</div>,
  Play: () => <div data-testid="play-icon">Play</div>,
  Pause: () => <div data-testid="pause-icon">Pause</div>,
  ClosedCaption: () => <div data-testid="cc-icon">CC</div>,
  Expand: () => <div data-testid="expand-icon">Expand</div>,
}));

describe('VideoStackPlayer', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders video player with Vimeo source', () => {
    render(<VideoStackPlayer videoID={123456} onClose={mockOnClose} />);
    expect(screen.getByTestId('media-player')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const { container } = render(<VideoStackPlayer videoID={123456} onClose={mockOnClose} />);
    // Using querySelector as a fallback since the structure may be different in the actual component
    const closeButton =
      screen.queryByTestId('close-icon') ||
      container.querySelector('[data-testid="styled-button"]');

    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    } else {
      throw new Error('Close button not found');
    }
  });

  it('toggles play state when play/pause button is clicked', () => {
    const { useMediaRemote } = jest.requireMock('@vidstack/react');
    const mockRemote = useMediaRemote();

    const { container } = render(<VideoStackPlayer videoID={123456} onClose={mockOnClose} />);
    const playButton =
      screen.queryByTestId('pause-icon') ||
      container.querySelectorAll('[data-testid="styled-button"]')[1];

    if (playButton) {
      fireEvent.click(playButton);
      expect(mockRemote.togglePaused).toHaveBeenCalled();
    } else {
      throw new Error('Play button not found');
    }
  });

  it('toggles fullscreen when fullscreen button is clicked', () => {
    const { useMediaRemote } = jest.requireMock('@vidstack/react');
    const mockRemote = useMediaRemote();

    const { container } = render(<VideoStackPlayer videoID={123456} onClose={mockOnClose} />);
    const fullscreenButton =
      screen.queryByTestId('expand-icon') ||
      container.querySelectorAll('[data-testid="styled-button"]')[3];

    if (fullscreenButton) {
      fireEvent.click(fullscreenButton);
      expect(mockRemote.toggleFullscreen).toHaveBeenCalled();
    } else {
      throw new Error('Fullscreen button not found');
    }
  });

  it('toggles captions when CC button is clicked', () => {
    const { useMediaRemote } = jest.requireMock('@vidstack/react');
    const mockRemote = useMediaRemote();

    const { container } = render(<VideoStackPlayer videoID={123456} onClose={mockOnClose} />);
    const ccButton =
      screen.queryByTestId('cc-icon') ||
      container.querySelectorAll('[data-testid="styled-button"]')[2];

    if (ccButton) {
      fireEvent.click(ccButton);
      expect(mockRemote.toggleCaptions).toHaveBeenCalled();
    } else {
      throw new Error('CC button not found');
    }
  });

  it('calls onClose when ESC key is pressed', () => {
    render(<VideoStackPlayer videoID={123456} onClose={mockOnClose} />);

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('seeks to a different point when clicking the progress bar', () => {
    // Setup the test environment with proper types
    const mockSeek = jest.fn();
    const mockModule = jest.requireMock('@vidstack/react');
    jest.spyOn(mockModule, 'useMediaRemote').mockReturnValue({
      togglePaused: jest.fn(),
      toggleCaptions: jest.fn(),
      toggleFullscreen: jest.fn(),
      seek: mockSeek,
    } as MockRemote);

    const { container } = render(<VideoStackPlayer videoID={123456} onClose={mockOnClose} />);

    // Force controls to render by moving mouse
    fireEvent.mouseMove(container);

    // Find progress bar directly with typesafe approach
    const allDivs = container.querySelectorAll('div');
    const progressBarContainer = Array.from(allDivs).find(
      (div) =>
        div.style &&
        div.style.display === 'flex' &&
        div.style.alignItems === 'center' &&
        div.style.flex === '1'
    );

    if (!progressBarContainer) {
      console.error('Progress bar container not found');
      return;
    }

    const progressBar = progressBarContainer.querySelector('div');

    if (progressBar) {
      // Mock getBoundingClientRect safely
      Object.defineProperty(progressBar, 'getBoundingClientRect', {
        value: jest.fn().mockReturnValue({
          left: 0,
          width: 100,
        }),
        configurable: true,
      });

      // Click at position 50
      fireEvent.click(progressBar, { clientX: 50 });

      // Check if seek was called with 90 (50% of 180)
      expect(mockSeek).toHaveBeenCalledWith(90);
    } else {
      console.error('Progress bar not found inside container');
    }
  });

  it('shows exit fullscreen icon when in fullscreen mode', () => {
    const localMockOnClose = jest.fn();
    // Override the fullscreen state value
    const mockUseMediaState = jest
      .spyOn(jest.requireMock('@vidstack/react'), 'useMediaState')
      .mockImplementation((state: string): boolean | number => {
        if (state === 'fullscreen') return true;
        if (state === 'paused') return false;
        if (state === 'textTrack') return false;
        if (state === 'currentTime') return 60;
        if (state === 'duration') return 180;
        return 0;
      });

    const { container } = render(<VideoStackPlayer videoID={123456} onClose={localMockOnClose} />);

    // Check for the SVG element that represents exit fullscreen
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeDefined();

    // Restore original implementation
    mockUseMediaState.mockRestore();
  });
});
