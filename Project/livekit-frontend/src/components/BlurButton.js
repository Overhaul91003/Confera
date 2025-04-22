/*

GITHUB Source Code : https://github.com/livekit/track-processors-js

Source Map Not At all req fro Media Pipe so completely Ignore the warning you are seeing .
*/




import React, { useState, useEffect } from 'react';
import { BackgroundBlur, VirtualBackground } from '@livekit/track-processors';
import { useLocalParticipant, useTracks } from '@livekit/components-react';
import OfficeBackground from "../Pictures/OfficeBackground.jpg" ;

const BlurButton = () => {
  const [selectedEffect, setSelectedEffect] = useState('none');
  const [processor, setProcessor] = useState(null);
  const { localParticipant } = useLocalParticipant();
  const videoTrack = useTracks([{ source: 'camera', participant: localParticipant }])[0]?.publication?.track;

  useEffect(() => {
    return () => {
      if (videoTrack && processor) {
        videoTrack.stopProcessor();
      }
    };
  }, [videoTrack, processor]);

  const applyEffect = async (effect) => {
    if (!videoTrack) return;

    if (processor) {
      await videoTrack.stopProcessor();
      setProcessor(null);
    }

    let newProcessor = null;

    if (effect === 'blur') {
      newProcessor = BackgroundBlur(15); // Adjust blur radius as needed
    } else if (effect === 'virtual') {
      const imagePath = OfficeBackground;
      newProcessor = VirtualBackground(imagePath);
    }

    if (newProcessor) {
      await videoTrack.setProcessor(newProcessor);
      setProcessor(newProcessor);
    }

    setSelectedEffect(effect);
  };

  return (
    <div>
      <select
        value={selectedEffect}
        onChange={(e) => applyEffect(e.target.value)}
        style={{
          padding: '10px',
          borderRadius: '10px',
          border: '1px solid #ccc',
          cursor: 'pointer',
        }}
      >
        <option value="none">Normal</option>
        <option value="blur">Blur</option>
        <option value="virtual">Virtual</option>
      </select>
    </div>
  );
};

export default BlurButton;






