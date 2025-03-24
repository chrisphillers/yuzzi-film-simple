'use client';
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

// Separate the styled components for testability
export const PlayerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const ControlsContainer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  z-index: 10;
`;

export const PlayButton = styled.button`
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

  &::before {
    content: '';
    position: absolute;
    top: -30px;
    left: -30px;
    right: -30px;
    bottom: -30px;
  }
`;

export const CloseButton = styled.button`
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

export const BottomBar = styled.div`
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

export const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background-color: #666;
  border-radius: 4px;
  margin: 0 16px;
  position: relative;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: -25px;
    left: 0;
    right: 0;
    bottom: -25px;
  }
`;

export const Progress = styled.div`
  height: 100%;
  background-color: #3d7ff6;
  border-radius: 4px;
  width: ${(props) => `${isNaN(props?.width) ? 0 : props?.width}%`};
`;

export const TimeText = styled.span`
  color: white;
  font-size: 14px;
  margin: 0 8px;
`;

export const ControlButton = styled.button`
  color: white;
  padding: 4px;
  cursor: pointer;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Export these for testing
export const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds)) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Custom control components - exported for testing
export const Controls = ({ onClose }: { onClose?: () => void }) => {
  const isPaused = useMediaState('paused');
  const isFullscreen = useMediaState('fullscreen');
  const captionsActive = useMediaState('textTrack');
  const currentTime = useMediaState('currentTime');
  const duration = useMediaState('duration');
  const remote = useMediaRemote();

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Close button clicked');

    if (typeof onClose === 'function') {
      console.log('Calling onClose function');
      onClose();

      setTimeout(() => {
        console.log('Retry close after delay');
        onClose();
      }, 100);
    }
  };

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

  const handleSeek = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    if (remote && duration) {
      remote.seek(position * duration);
    }
  };

  return (
    <ControlsContainer data-testid="controls-container">
      <CloseButton onClick={handleClose} data-testid="close-button">
        <Close color="white" size="medium" />
      </CloseButton>

      <PlayButton onClick={() => remote.togglePaused()} data-testid="play-button">
        {isPaused ? <Play color="white" size="large" /> : <Pause color="white" size="large" />}
      </PlayButton>

      <BottomBar data-testid="bottom-bar">
        <ControlButton onClick={handleToggleCaptions} data-testid="captions-button">
          {captionsActive ? (
            <ClosedCaption color="#3d7ff6" size="medium" />
          ) : (
            <ClosedCaption color="white" size="medium" />
          )}
        </ControlButton>

        <div
          style={{ display: 'flex', alignItems: 'center', flex: '1' }}
          data-testid="progress-container"
        >
          <TimeText data-testid="current-time">{formatTime(currentTime)}</TimeText>
          <ProgressBar onClick={handleSeek} data-testid="progress-bar">
            <Progress width={(currentTime / duration) * 100} data-testid="progress-indicator" />
          </ProgressBar>
          <TimeText data-testid="duration">{formatTime(duration)}</TimeText>
        </div>

        <ControlButton onClick={() => remote.toggleFullscreen()} data-testid="fullscreen-button">
          {isFullscreen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              data-testid="exit-fullscreen-icon"
            >
              <path d="M8 3v3a2 2 0 0 1-2 2H3" />
              <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
              <path d="M3 16h3a2 2 0 0 1 2 2v3" />
              <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
            </svg>
          ) : (
            <Expand color="white" size="medium" data-testid="fullscreen-icon" />
          )}
        </ControlButton>
      </BottomBar>
    </ControlsContainer>
  );
};

interface VideoStackPlayerProps {
  videoID: number;
  onClose?: () => void;
}

export const VideoStackPlayer: React.FC<VideoStackPlayerProps> = ({ videoID, onClose }) => {
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
    <PlayerContainer
      onMouseMove={showControlsWithTimeout}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        setTimeout(() => setShowControls(false), 1000);
      }}
      data-testid="player-container"
    >
      <MediaPlayer
        ref={player}
        autoPlay={true}
        style={{ aspectRatio: '16/9', width: '100%', height: '100%' }}
        load="eager"
        onClick={(e) => {
          e.stopPropagation();
        }}
        src={{
          src: `https://vimeo.com/${videoID}`,
          type: 'video/vimeo',
        }}
        crossOrigin="anonymous"
        data-testid="media-player"
      >
        <MediaProvider data-testid="media-provider" />

        <track
          src={`https://vimeo.com/${videoID}/captions`}
          kind="subtitles"
          srcLang="en"
          label="English"
        />

        {showControls && <Controls onClose={onClose} />}
      </MediaPlayer>
    </PlayerContainer>
  );
};
