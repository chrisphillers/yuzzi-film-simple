'use client';

import { useState } from 'react';
import { Box, Layer } from 'grommet';
import Vimeo from '@u-wave/react-vimeo';
import { VideoStackPlayer } from './ui/videomodal';

export const Hero = ({ title }: { title: string }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [openVideo, setOpenVideo] = useState<boolean>(false);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);

  return (
    <Box
      style={{
        position: 'relative',
        paddingTop: '56.25%', // 16:9 aspect ratio (9/16 = 0.5625)
        width: '100%',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setOpenVideo(!openVideo)}
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
              width: '0',
              height: '0',
              borderTop: '40px solid transparent',
              borderBottom: '40px solid transparent',
              borderLeft: '80px solid var(--color-brand-primary)',
            }}
          />
        )}

        {isVideoLoading && (
          <Box
            fill
            align="center"
            justify="center"
            background="var(--color-grey)"
            style={{ position: 'absolute', zIndex: 1 }}
          >
            {/* <Loading /> */}
          </Box>
        )}

        <Vimeo
          id={title}
          video="76979871"
          autoplay={true}
          muted={true}
          loop={true}
          controls={false}
          responsive={true}
          onReady={() => setIsVideoLoading(false)}
          onLoaded={() => setIsVideoLoading(false)}
          onError={() => setIsVideoLoading(false)}
        />
      </Box>

      {openVideo && (
        <>
          <FullScreenVideo
            onClose={() => setOpenVideo(!openVideo)}
            title={title}
            videoID={150781794}
          ></FullScreenVideo>
        </>
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
        // fill
        // pad={'medium'}
        // // pad={{ vertical: 'large' }}
        // // height={'200px'}
        // // maxHeight={}
        // // margin={{ bottom: '120px' }}
        // align="center"
        // justify="center"
        // // height={'calc(100vh-200px)'}
      >
        <VideoStackPlayer videoID={videoID} title={title}></VideoStackPlayer>
      </Box>
    </Layer>
  );
};
