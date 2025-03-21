'use client';
// import Vimeo from '@u-wave/react-vimeo';
import { Box } from 'grommet';
import { useState } from 'react';

export const Hero = ({ title }: { title: string }) => {
  const [isHovered, setIsHovered] = useState(false);

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
              zIndex: 10,
              width: '0',
              height: '0',
              borderTop: '40px solid transparent',
              borderBottom: '40px solid transparent',
              borderLeft: '80px solid var(--color-brand-primary)',
            }}
          />
        )}

        {/* <Vimeo
          id={title}
          video="76979871"
          autoplay={true}
          muted={true}
          loop={true}
          controls={false}
          responsive={true}
        /> */}
      </Box>
    </Box>
    // </Suspense>
  );
};
