import React, { useState } from "react"; 
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import MeetingSelection from "./components/MeetingSelection";
import PreJoinScreen from "./components/PreJoinScreen";
import useLiveKitToken from "./hooks/useLiveKitToken";
import InnerConferenceContent from "./components/InnerConferenceContent";





import {
  LiveKitRoom,
  RoomAudioRenderer,
  LayoutContextProvider,
} from "@livekit/components-react";

import "@livekit/components-styles";

const serverUrl = "ws://localhost:7880";

const ConferenceRoom = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomName = queryParams.get("room");
  const participantName = queryParams.get("name") || `user-${Date.now()}`;
  const videoEnabled = queryParams.get("video") === "true";
  const audioEnabled = queryParams.get("audio") !== "false";

  const { token, error } = useLiveKitToken(roomName, participantName, true);

  if (error) return <div>Error: {error}</div>;
  if (!token) return <div>Loading token...</div>;

  return (
    <LiveKitRoom
      video={videoEnabled}
      audio={audioEnabled}
      token={token}
      serverUrl={serverUrl}
      data-lk-theme="default"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <LayoutContextProvider>
        <InnerConferenceContent />
      </LayoutContextProvider>

      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MeetingSelection />} />
        
        {/* PreJoinScreen with Props */}
        <Route
          path="/prejoin"
          element={<PreJoinScreenWrapper />}
        />
        
        <Route path="/conference" element={<ConferenceRoom />} />
      </Routes>
    </Router>
  );
}

// Wrapper for PreJoinScreen to manage state & navigation
const PreJoinScreenWrapper = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomName = queryParams.get("room");
  const navigate = useNavigate();

  const [participantName, setParticipantName] = useState(`user-${Date.now()}`);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  return (
    <PreJoinScreen
      roomName={roomName}
      setParticipantName={setParticipantName}
      setIsPreJoinComplete={() => {
        navigate(`/conference?room=${roomName}&name=${participantName}&video=${videoEnabled}&audio=${audioEnabled}`);
      }}
      setVideoEnabled={setVideoEnabled}
      setAudioEnabled={setAudioEnabled}
    />
  );
};























