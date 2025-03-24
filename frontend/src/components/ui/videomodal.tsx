import React, { useRef, useState, useEffect } from 'react';
import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerInstance,
  useMediaState,
  useMediaRemote,
} from '@vidstack/react';
import { Close, Play, Pause, ClosedCaption, Expand } from 'grommet-icons';
import styled from 'styled-components';

// Import the required styles
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

interface VideoStackPlayerProps {
  videoID: number;
  onClose?: () => void;
  title: string;
}

const StyledControlsContainer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  z-index: 10;
`;

const StyledPlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  border: none;
  padding: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Increase hit area */
  &::before {
    content: '';
    position: absolute;
    top: -30px;
    left: -30px;
    right: -30px;
    bottom: -30px;
  }
`;

const StyledCloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
`;

const StyledBottomBar = styled.div`
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  margin: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  padding: 8px;
`;

const StyledProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background-color: #666;
  border-radius: 4px;
  margin: 0 16px;
  position: relative;
  cursor: pointer;

  /* Increase hit area */
  &::before {
    content: '';
    position: absolute;
    top: -25px;
    left: 0;
    right: 0;
    bottom: -25px;
  }
`;

const StyledProgress = styled.div.attrs<{ $progress: number }>((props) => ({
  style: {
    width: `${isNaN(props.$progress) ? 0 : props.$progress}%`,
  },
}))`
  height: 100%;
  background-color: #3d7ff6;
  border-radius: 4px;
`;

const StyledTimeText = styled.span`
  color: white;
  font-size: 14px;
  margin: 0 8px;
`;

const StyledControlButton = styled.button`
  color: white;
  padding: 4px;
  cursor: pointer;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const VideoStackPlayer: React.FC<VideoStackPlayerProps> = ({ videoID, onClose, title }) => {
  const player = useRef<MediaPlayerInstance>(null);
  const [showControls, setShowControls] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showControlsWithTimeout = () => {
    setShowControls(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && typeof onClose === 'function') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onClose]);

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onMouseMove={showControlsWithTimeout}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        // Delay hiding controls when mouse leaves
        setTimeout(() => setShowControls(false), 1000);
      }}
    >
      <MediaPlayer
        ref={player}
        autoPlay={true}
        style={{ aspectRatio: '16/9', width: '100%', height: '100%' }}
        load="eager"
        title={title}
        onClick={(e) => {
          // Stop propagation only on the video player itself
          e.stopPropagation();
        }}
        src={{
          src: `https://vimeo.com/${videoID}`,
          type: 'video/vimeo',
        }}
        crossOrigin="anonymous"
      >
        <MediaProvider />

        {/* Add text tracks for captions if available from Vimeo */}
        <track
          src={`https://vimeo.com/${videoID}/captions`}
          kind="subtitles"
          srcLang="en"
          label="English"
        />

        {/* Custom controls */}
        {showControls && <Controls onClose={onClose} />}
      </MediaPlayer>
    </div>
  );
};

// Custom control components
const Controls = ({ onClose }: { onClose?: () => void }) => {
  const isPaused = useMediaState('paused');
  const isFullscreen = useMediaState('fullscreen');
  const captionsActive = useMediaState('textTrack');
  const currentTime = useMediaState('currentTime');
  const duration = useMediaState('duration');
  const remote = useMediaRemote();

  // Handle close button click
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Close button clicked');

    // Try multiple approaches to ensure close works
    if (typeof onClose === 'function') {
      console.log('Calling onClose function');
      onClose();

      // Add a delay and try again if needed
      setTimeout(() => {
        console.log('Retry close after delay');
        onClose();
      }, 100);
    }
  };

  // Handle CC button click
  const handleToggleCaptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('CC button clicked');
    try {
      remote.toggleCaptions();
    } catch (err) {
      console.error('Error toggling captions:', err);
    }
  };

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <StyledControlsContainer>
      {/* Close button in top right */}
      <StyledCloseButton onClick={handleClose}>
        <Close color="white" size="medium" />
      </StyledCloseButton>

      {/* Play/Pause button in center */}
      <StyledPlayButton onClick={() => remote.togglePaused()}>
        {isPaused ? <Play color="white" size="large" /> : <Pause color="white" size="large" />}
      </StyledPlayButton>

      {/* Bottom control bar */}
      <StyledBottomBar>
        {/* Left side - captions toggle */}
        <StyledControlButton onClick={handleToggleCaptions}>
          {captionsActive ? (
            <ClosedCaption color="#3d7ff6" size="medium" />
          ) : (
            <ClosedCaption color="white" size="medium" />
          )}
        </StyledControlButton>

        {/* Center - progress bar and time */}
        <div style={{ display: 'flex', alignItems: 'center', flex: '1' }}>
          <StyledTimeText>{formatTime(currentTime)}</StyledTimeText>
          <StyledProgressBar
            onClick={(e) => {
              e.stopPropagation();
              // Calculate click position as a percentage of the progress bar's width
              const rect = e.currentTarget.getBoundingClientRect();
              const position = (e.clientX - rect.left) / rect.width;
              // Seek to the calculated position
              if (remote && duration) {
                remote.seek(position * duration);
              }
            }}
          >
            <StyledProgress $progress={(currentTime / duration) * 100} />
          </StyledProgressBar>
          <StyledTimeText>{formatTime(duration)}</StyledTimeText>
        </div>

        {/* Right side - fullscreen toggle */}
        <StyledControlButton onClick={() => remote.toggleFullscreen()}>
          {isFullscreen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M8 3v3a2 2 0 0 1-2 2H3" />
              <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
              <path d="M3 16h3a2 2 0 0 1 2 2v3" />
              <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
            </svg>
          ) : (
            <Expand color="white" size="medium" />
          )}
        </StyledControlButton>
      </StyledBottomBar>
    </StyledControlsContainer>
  );
};
