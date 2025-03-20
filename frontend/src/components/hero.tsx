'use client';
// import Vimeo from '@u-wave/react-vimeo';
import { Box } from 'grommet';
import { useState } from 'react';

export const Hero = ({ title }: { title: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Box
      style={{
        position: 'relative',
        paddingTop: '56.25%', // 16:9 aspect ratio (9/16 = 0.5625)
        width: '100%', // Maintains responsiveness
        overflow: 'hidden',
        backgroundColor: 'var(--color-grey)',
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
        }}
      >
        {/* Play button overlay */}
        {isHovered && (
          <Box
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              width: '0',
              height: '0',
              borderTop: '40px solid transparent',
              borderBottom: '40px solid transparent',
              borderLeft: '80px solid var(--color-brand-primary)', // Using brandPrimary for play button color
              cursor: 'pointer',
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
  );
};
