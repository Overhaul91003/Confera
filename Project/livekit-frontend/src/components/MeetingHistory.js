import React, { useState, useEffect } from "react";
import { getHistory } from "../utils/meetingHistory";

const styles = {
  heading: {
    fontWeight: "bold",
    fontSize: "25px",
    marginTop: "30px",
    marginBottom: "10px",
    justifyContent: "center",
  },
  headerRow: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "2px solid #fff",
    fontWeight: "bold",
    width: "60%",
    gap: "20px",
  },
  noHistory: {
    textAlign: "center",
    opacity: "0.7",
  },
  historyList: {
    listStyleType: "none",
    padding: 0,
    width: "60%",
  },
  historyItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #444",
    width: "100%",
    gap: "20px",
  },
  roomName: {
    fontWeight: "bold",
    fontSize: "16px",
    minWidth: "150px",
  },
  date: {
    fontWeight: "bold",
    fontSize: "14px",
    opacity: "0.8",
    minWidth: "120px",
  },
  time: {
    fontWeight: "bold",
    fontSize: "14px",
    opacity: "0.8",
    minWidth: "100px",
  },
  duration: {
    fontWeight: "bold",
    fontSize: "14px",
    opacity: "0.8",
    minWidth: "100px",
  },
  deleteButton: {
    background: "#cc0000",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

// Format just the date portion
function formatDate(ms) {
  const d = new Date(ms);
  return d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Format just the time portion
function formatTime(ms) {
  const d = new Date(ms);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}m ${s}s`;
}

export default function MeetingHistory() {
const [history, setHistory] = useState([]);

useEffect(() => {
  setHistory(getHistory(10));
}, []);

// Clears all entries both from localStorage and component state
const handleClearAll = () => {
  localStorage.removeItem("meeting_history");
  setHistory([]);
};


const handleDelete = (joinTime) => {
  const all = JSON.parse(localStorage.getItem("meeting_history") || "[]");
  const updatedAll = all.filter((e) => e.joinTime !== joinTime);
  localStorage.setItem("meeting_history", JSON.stringify(updatedAll));
  setHistory(getHistory(10));
};

  return (
    <>
      {/* Center the title + button as one group */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',          // full width of parent
        }}
      >
        <h3
          style={{
            ...styles.heading,
            margin: 0,                 // override top/bottom margins
          }}
        >
          Recent Meetings
        </h3>

        <button
          onClick={handleClearAll}
          style={{
            background: '#EE4B2B',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '5px 10px',
            cursor: 'pointer',
            marginLeft: '10px',   // small gap to the right of the title
            alignSelf: 'center',      // ensure it sits centered
          }}
        >
          Clear All
        </button>
      </div>

      
      {history.length === 0 ? (
        <p style={styles.noHistory}>No recent meetings.</p>
      ) : (
        <>
          {/* Column headers */}
          <div style={styles.headerRow}>
            <span style={styles.roomName}>Room Name</span>
            <span style={styles.date}>Date</span>
            <span style={styles.time}>Join Time</span>
            <span style={styles.time}>Leave Time</span>
            <span style={styles.duration}>Duration</span>
            <span></span>
          </div>

          <ul style={styles.historyList}>
            {history.map((e, i) => (
              <li key={i} style={styles.historyItem}>
                <span style={styles.roomName}>{e.roomName}</span>
                <span style={styles.date}>{formatDate(e.joinTime)}</span>
                <span style={styles.time}>{formatTime(e.joinTime)}</span>
                <span style={styles.time}>{e.leaveTime ? formatTime(e.leaveTime) : "—"}</span>
                <span style={styles.duration}>
                  {e.durationMs
                    ? formatDuration(e.durationMs)
                    : formatDuration(Date.now() - e.joinTime)}
                </span>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(e.joinTime)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}






