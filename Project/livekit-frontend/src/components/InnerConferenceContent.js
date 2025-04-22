import React from "react";
import Container from "./Container";
import CustomControlBar from "./CustomControlBar";
import VideoConference from "./VideoConference";

const InnerConferenceContent = () => {
  return (
    <>
      <div style={{ flex: 1 }}>
        <VideoConference />
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#222",
          gap: "10px",
        }}
      >
        <Container />
        <CustomControlBar />
      </div>
    </>
  );
};

export default InnerConferenceContent;











  
  