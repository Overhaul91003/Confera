import React from "react";
import { useNavigate } from "react-router-dom";
import { PreJoin } from "@livekit/components-react";

const PreJoinScreen = ({ roomName, setIsPreJoinComplete, setVideoEnabled, setAudioEnabled }) => {
  const navigate = useNavigate();

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
          let finalName = values.username.trim() || `user-${Date.now()}`;
          setIsPreJoinComplete(true);
          setVideoEnabled(values.videoEnabled);
          setAudioEnabled(values.audioEnabled);

          navigate(`/conference?room=${roomName}&name=${encodeURIComponent(finalName)}&video=${values.videoEnabled}&audio=${values.audioEnabled}`);
        }}
      />
    </div>
  );
};

export default PreJoinScreen;



