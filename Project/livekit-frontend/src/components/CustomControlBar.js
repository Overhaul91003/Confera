import React from 'react';
import { ControlBar, DisconnectButton} from '@livekit/components-react';
import { useNavigate , useLocation } from 'react-router-dom';
import { addLeave } from "../utils/meetingHistory";


/* 

These can also be added for controls  in Control Bar : 

        settings: true,
        recording: true,
        raiseHand: true,
        participantList: true,
        toggleView: true,
        debug: false
        

*/

const CustomControlBar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const roomName = new URLSearchParams(location.search).get('room');
  

  // record leave, then navigate home
  const handleLeave = () => {
    addLeave(roomName);
    navigate('/');
  };

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: "10px",
      position: "relative",    
    }}>
      <ControlBar
        controls={{
          microphone: true,
          camera: true,
          screenShare: true,
          leave: false, // Hiding default leave button
          chat: false ,
        }}
      />

      
      {/* Leave Button */}
      <DisconnectButton 
        onClick={handleLeave} 
        style={{
          background: 'red',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '10px',
          fontSize: '16px',
          cursor: 'pointer',
          border: 'none'
        }}
      >
        Leave 
      </DisconnectButton>

      
    </div>

  );
};

export default CustomControlBar;