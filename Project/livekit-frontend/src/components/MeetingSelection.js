import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MeetingHistory from "./MeetingHistory";

const MeetingSelection = () => {
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  // Fetch active rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:3000/rooms");
        setRooms(response.data.rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  // Create Room
  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      alert("Please enter a room name.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/createRoom", { roomName });
      localStorage.removeItem(`chatMessages_${roomName}`);
      alert("Success, Room has been created!");
      setRooms([...rooms, { name: roomName, participants: 0 }]);
      setRoomName("");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Room already exists!");
      } else {
        alert("Error creating room.");
        console.error("Error creating room:", error);
      }
    }
  };

  // Join Room
  const handleJoinRoom = async (room) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/getToken?roomName=${room.name}&participantName=Guest`
      );

      if (response.data.token) {
        // Navigate to prejoin; actual join recording happens on prejoin submit
        navigate(`/prejoin?room=${room.name}`);
      } else {
        setError("Room does not exist. Please create one first.");
      }
    } catch (err) {
      setError("Room does not exist.");
    }
  };

  // Copy join link to clipboard
  const handleCopyLink = (roomName) => {
    const link = `${window.location.origin}/prejoin?room=${roomName}`;
    navigator.clipboard.writeText(link)
      .then(() => alert('Link copied to clipboard!'))
      .catch(() => alert('Failed to copy link'));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Confera</h1>

      {/* Room Input and Create Button */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleCreateRoom} style={styles.createButton}>
          Create Room
        </button>
      </div>

      {/* Active Rooms Section */}
      <h3 style={styles.roomsHeading}>Active Rooms</h3>
      {rooms.length > 0 ? (
        <ul style={styles.roomsList}>
          {rooms.map((room) => (
            <li key={room.name} style={styles.roomItem}>
              <span style={styles.roomName}>{room.name}</span>
              <span style={styles.participants}>
                {room.participants} participant(s)
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleJoinRoom(room)} style={styles.joinButton}>
                  Join
                </button>
                <button onClick={() => handleCopyLink(room.name)} style={styles.copyButton}>
                  Copy Link
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.noRooms}>No active rooms.</p>
      )}

      {error && <p style={styles.errorText}>{error}</p>}

      {/* History Section */}
      <MeetingHistory />
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#121212",
    color: "#ffffff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "50px",
    fontFamily: "'Arial', sans-serif",
  },
  heading: {
    fontSize: "60px",
    fontWeight: "bold",
    textAlign: "center",
    background: "linear-gradient(90deg, #6a11cb, #2575fc, #6a11cb)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "shimmer 3s linear infinite",
    textShadow: "0 0 10px rgba(255,255,255,0.5)",
    marginBottom: "40px",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "30px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    width: "250px",
    borderRadius: "5px",
    border: "1px solid #555",
    backgroundColor: "#1e1e1e",
    color: "#fff",
  },
  createButton: {
    padding: "10px 20px",
    fontSize: "16px",
    background: "#28a745",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "0.3s",
  },
  roomsHeading: {
    fontSize: "40px",
    fontWeight: "bold",
    textAlign: "left",
    background: "linear-gradient(90deg, #39ff14, #9d00ff, #39ff14)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "shimmer 3s linear infinite",
    textShadow: "0 0 10px rgba(255,255,255,0.5)",
    marginBottom: "20px",
  },
  roomsList: {
    listStyleType: "none",
    padding: 0,
    width: "60%",
    marginBottom: 60 ,
  },
  roomItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #444",
  },
  roomName: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  participants: {
    fontSize: "14px",
    opacity: "0.8",
  },
  joinButton: {
    padding: "8px 16px",
    fontSize: "14px",
    background: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "0.3s",
  },
  copyButton: {
    padding: "8px 16px",
    fontSize: "14px",
    background: "#17a2b8",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "0.3s",
  },
  noRooms: {
    textAlign: "center",
    opacity: "0.7",
  },
  errorText: {
    color: "red",
    marginTop: "10px",
  },
};

export default MeetingSelection;








