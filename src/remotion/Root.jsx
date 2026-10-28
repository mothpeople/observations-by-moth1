import React from 'react';
import { Composition } from 'remotion';
import { WateringGrassReel } from './WateringGrassReel.jsx';
import { MeatGrinderReel } from './MeatGrinderReel.jsx';

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
      <Composition
        id="MeatGrinderReel"
        component={MeatGrinderReel}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
