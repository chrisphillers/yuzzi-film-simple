'use client';
import { Suspense, lazy, useState } from 'react';
import { Box, Layer, Skeleton } from 'grommet';
import { VideoStackPlayer } from './ui/videomodal';

// Lazy-load the Vimeo component
const VimeoPlayer = lazy(() => import('@u-wave/react-vimeo'));

// Skeleton fallback
const VideoSkeleton = () => <Skeleton width="100%" height="100%" round={true} />;

export const Hero = ({ title }: { title: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);

  return (
    <Box
      style={{
        position: 'relative',
        paddingTop: '56.25%', // 16:9 aspect ratio (9/16 = 0.5625)
        width: '100%',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => isLoaded && setOpenVideo(true)}
    >
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'var(--color-grey)',
        }}
      >
        {/* Play button overlay */}
        {isHovered && (
          <Box
            style={{
              cursor: 'pointer',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              width: 0,
              height: 0,
              borderTop: '40px solid transparent',
              borderBottom: '40px solid transparent',
              borderLeft: '80px solid var(--color-brand-primary)',
            }}
          />
        )}

        <Suspense fallback={<VideoSkeleton />}>
          <VimeoPlayer
            id={title}
            video="76979871"
            autoplay={true}
            muted={true}
            loop={true}
            controls={false}
            responsive={true}
            playsInline={true}
            transparent={true}
            background={true}
            onLoaded={() => setIsLoaded(true)}
            onError={() => setIsLoaded(true)}
            dnt={true}
          />
        </Suspense>
      </Box>

      {openVideo && (
        <FullScreenVideo onClose={() => setOpenVideo(false)} title={title} videoID={150781794} />
      )}
    </Box>
  );
};

interface ModalVideoProps {
  onClose?: () => void;
  title: string;
  videoID: number;
}

const FullScreenVideo: React.FC<ModalVideoProps> = ({ onClose, title, videoID }) => {
  return (
    <Layer
      full={true}
      animation={'fadeIn'}
      animate={true}
      onEsc={onClose}
      onClickOutside={onClose}
      background="black"
    >
      <Box
        align="center"
        justify="center"
        pad="medium"
        height="100%"
        width="100%"
        onClick={(e) => {
          // Stop clicks on the box from propagating to Layer
          e.stopPropagation();
        }}
      >
        <VideoStackPlayer videoID={videoID} onClose={onClose} title={title} />
      </Box>
    </Layer>
  );
};
