import React from 'react';
import {
  LiveKitRoom,
  LayoutContextProvider,
  RoomAudioRenderer,
} from '@livekit/components-react';
import VideoConference from './VideoConference';

const LiveKitRoomWrapper = ({ token, serverUrl, videoEnabled, audioEnabled, children }) => {
  return (
    <LiveKitRoom
      video={videoEnabled}
      audio={audioEnabled}
      token={token}
      serverUrl={serverUrl}
      data-lk-theme="default"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <LayoutContextProvider>
        <div style={{ flex: 1 }}>
          <VideoConference />
        </div>
        {children}
      </LayoutContextProvider>
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

export default LiveKitRoomWrapper;
