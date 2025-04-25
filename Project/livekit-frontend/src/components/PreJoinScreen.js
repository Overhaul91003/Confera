import React from "react";
import { PreJoin } from "@livekit/components-react";

/**
 * Props:
 * - roomName: string
 * - onSubmit: (values: { username: string; videoEnabled: boolean; audioEnabled: boolean }) => void
 * - setVideoEnabled: (enabled: boolean) => void
 * - setAudioEnabled: (enabled: boolean) => void
 */
const PreJoinScreen = ({ roomName, onSubmit, setVideoEnabled, setAudioEnabled }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#333",
        position: "relative",
        color: "white",
      }}
    >
      <h1>Waiting Room</h1>

      <PreJoin
        onSubmit={(values) => {
          // update media preferences
          setVideoEnabled(values.videoEnabled);
          setAudioEnabled(values.audioEnabled);
          // delegate join handling (including addJoin and navigation) to parent
          onSubmit(values);
        }}
      />
    </div>
  );
};

export default PreJoinScreen;




