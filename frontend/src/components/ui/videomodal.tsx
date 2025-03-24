'use client';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

export const VideoStackPlayer = ({ videoID, title }: { videoID: number; title: string }) => {
  return (
    <MediaPlayer
      onClick={(e) => {
        // Stop propagation only on the video player itself
        e.stopPropagation();
      }}
      title={title}
      src={`vimeo/${videoID}`}
      aspectRatio={'16 / 9'}
      autoPlay={true}
      style={{
        width: '100%',
        maxWidth: '1280px', // Maximum width in fullscreen
        height: 'auto',
        maxHeight: '90vh', // Maximum height (90% of viewport height)
      }}
    >
      <MediaProvider />
      <DefaultVideoLayout
        thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
        icons={defaultLayoutIcons}
      />
    </MediaPlayer>
  );
};
