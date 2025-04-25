import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const RecordButton = () => {
  const [isRecording, setIsRecording] = useState(false);
  const params = new URLSearchParams(useLocation().search);
  const roomName = params.get('room');

  const toggleRecording = async () => {
    try {
      if (!isRecording) {
        // Start recording
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/record/start`, { roomName });
        console.log(res.data); // { message, filename }
      } else {
        // Stop recording
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/record/stop`, { roomName });
        console.log(res.data); // { message: 'Recording stopped' }
      }
      setIsRecording(!isRecording);
    } catch (err) {
      console.error('Recording error:', err.response?.data || err.message);
      alert('Recording error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <button
      onClick={toggleRecording}
      style={{
        background: isRecording ? 'darkred' : '#4CAF50',
        color: 'white',
        padding: '10px',
        borderRadius: '10px',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {isRecording ? 'Stop' : 'Record'}
    </button>
  );
};

export default RecordButton;





