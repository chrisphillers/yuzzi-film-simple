'use client';
import Vimeo from '@u-wave/react-vimeo';

export const Hero = ({ title }: { title: string }) => {
  return (
    <Vimeo
      id={title}
      video="76979871"
      autoplay={true}
      muted={true}
      loop={true}
      controls={false}
      responsive={true}
    />
  );
};
