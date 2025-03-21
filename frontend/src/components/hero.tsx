'use client';
import Vimeo from '@u-wave/react-vimeo';
import { Box, Button } from 'grommet';
import { useState } from 'react';
import { Close } from 'grommet-icons';
import { styled } from 'styled-components';

export const Hero = ({ title }: { title: string }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [openVideo, setOpenVideo] = useState<boolean>(false);
  console.log(title);

  return (
    //TODO Suspense fix
    // <Suspense fallback={<p>Loading feed...</p>}>
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
          // TODO: To sort skeleton at some point
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

        <Vimeo
          id={title}
          video="76979871"
          autoplay={true}
          muted={true}
          loop={true}
          controls={false}
          responsive={true}
        />
      </Box>

      {openVideo && (
        <FullScreenVideo
          onClose={() => setOpenVideo(!openVideo)}
          title={title}
          videoID={150781794}
        ></FullScreenVideo>
      )}
    </Box>
    // </Suspense>
  );
};

interface MobileNavProps {
  onClose: () => void;
  title: string;
  videoID: number;
}

const VideoContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;

  .video-embed iframe {
    position: absolute;
    /* top: 0;
    left: 0; */
    width: 100% !important;
    height: 100% !important;
  }
`;

const FullScreenVideo: React.FC<MobileNavProps> = ({ onClose, title, videoID }) => {
  return (
    <Box
      // flex
      // fill
      // flex
      // fill
      // overflow="hidden"
      // pad="none"
      // margin="none"
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        // // right: 0,
        // // bottom: 0,
        backgroundColor: 'hotpink',
        maxHeight: '100vh',
        zIndex: 3,
        // overflow: 'hidden',
      }}
    >
      {/* <div
        id="COOOOIE"
        style={{
          position: 'relative',
          paddingBottom: '56.25%',
          // paddingBottom: '100%',
          height: 0,
          overflow: 'hidden',
        }}
      > */}
      <VideoContainer>
        <Vimeo
          id={title}
          video={videoID}
          autoplay={true}
          muted={false}
          loop={false}
          controls={true}
          background={false}
          // width={'100%'}
          // height={'100%'}
          // responsive={true}
          // style={{
          //   position: 'absolute',
          //   top: 0,
          //   left: 0,
          //   width: '100%',
          //   height: '100%',
          //   maxHeight: '100vh',
          // }}
        />
      </VideoContainer>
      {/* </div> */}
    </Box>
  );
  return (
    <Box
      // flex
      // fill
      flex
      fill
      overflow="hidden"
      pad="none"
      margin="none"
      style={{
        position: 'fixed',
        // width: '100vw',
        // height: '100vh',
        // // top: 0,
        // // left: 0,
        // // right: 0,
        // // bottom: 0,
        backgroundColor: 'hotpink',
        maxHeight: '100vh',
        zIndex: 3,
        // overflow: 'hidden',
      }}
    >
      {/* <Box flex align="end">
        <Button
          style={{ zIndex: 4 }}
          plain
          icon={<Close color="white" size="medium" />}
          onClick={onClose}
        />
      </Box> */}
      {/* {isHovered && (
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
      )} */}
      <Box flex fill overflow="hidden" pad="none" margin="none">
        {/* <div
        style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          overflow: 'hidden',
          width: '100%',
          maxHeight: 'calc(100vh - 50px)',
        }}
      > */}
        <Vimeo
          id={title}
          video={videoID}
          autoplay={true}
          muted={false}
          loop={false}
          controls={true}
          background={true}
          // height={'100%'}
          // width="100%"
          responsive={true}
          // style={{
          //   width: '100%',
          //   height: '100%',
          // }}
          // style={{
          //   // position: 'absolute',
          //   // top: 0,
          //   // left: 0,
          //   width: '100%',
          //   height: '100%',
          //   maxHeight: 'calc(100vh - 60px)',
          //   objectFit: 'contain',
          // }}
          // playsInline={true}
        />
        {/* </div> */}
      </Box>
    </Box>
  );
};
