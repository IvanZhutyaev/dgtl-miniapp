import React from 'react';

interface BackgroundVideoProps {
  src: string;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ src }) => (
  <video
    className="absolute inset-0 w-full h-full object-cover z-0"
    src={src}
    autoPlay
    loop
    muted
    playsInline
  />
);

export default BackgroundVideo;
