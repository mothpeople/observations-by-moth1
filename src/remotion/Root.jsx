import React from 'react';
import { Composition } from 'remotion';
import { WateringGrassReel } from './WateringGrassReel.jsx';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="WateringGrassReel"
        component={WateringGrassReel}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
