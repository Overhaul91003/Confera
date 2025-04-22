import React from "react";
import { useLocation } from "react-router-dom";
import RecordButton from "./RecordButton";
import BlurButton from "./BlurButton";
import InfoButton from "./InfoButton";
import ChatBox from "./ChatBox";


const Container = ( ) => {

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const roomName = params.get("room");
  
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#222",
        gap: "10px",
        position: "relative", // Important for the ChatBox to position absolutely
      }}
    >
      <ChatBox roomName={roomName} />
      <BlurButton />
      <RecordButton />
      <InfoButton />
    </div>
  );
};

export default Container;







      