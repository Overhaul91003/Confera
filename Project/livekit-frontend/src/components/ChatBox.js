import React, { useState, useEffect, useRef } from "react";
import {
  ChatIcon,
  ChatCloseIcon,
  useLocalParticipant,
} from "@livekit/components-react";

const ChatBox = ({ roomName }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);
  const { localParticipant } = useLocalParticipant();
  // Prefer the display name (token ‘name’), fall back to identity
  const participantName = localParticipant?.name || localParticipant?.identity || "You";


  const storageKey = `chatMessages_${roomName}`;

  // Load messages for current room on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(storageKey)) || [];
    setMessages(stored);

    const handleStorageChange = (event) => {
      if (event.key === storageKey) {
        const updated = JSON.parse(event.newValue) || [];
        setMessages(updated);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [storageKey]);

  // Scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      text: newMessage,
      senderName: participantName,
      senderId: localParticipant.identity,
      time: getCurrentTime(),
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setNewMessage("");
  };


  return (
    <>
      {/* Chat Toggle Button (inside control bar) */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          background: "#333",
          border: "none",
          borderRadius: "8px",
          padding: "8px 12px",
          cursor: "pointer",
          color: "white",
        }}
      >
        <ChatIcon />
      </button>

      {/* Chat Panel (positioned globally, does not shift layout) */}
      {chatOpen && (
        <div
          style={{
            position: "fixed", // ← fixed so it doesn't affect layout
            right: "20px",
            bottom: "70px", // above control bar
            height: "70vh",
            width: "400px",
            backgroundColor: "#1e1e1e",
            borderRadius: "16px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            color: "white",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              backgroundColor: "#2c2c2c",
              borderBottom: "1px solid #444",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "18px", flex: 1, textAlign: "center" }}>Chat</h3>
            <button
              onClick={() => setChatOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "white",
              }}
            >
              <ChatCloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
              borderRadius: "10px",
            }}
          >
            {messages.length === 0 ? (
              <div style={{ textAlign: "center", color: "#aaa" }}>No messages yet</div>
            ) : (
              messages.map((msg, index) => {
                const alignSelf = msg.senderId === localParticipant.identity ? "flex-end" : "flex-start";

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: alignSelf,
                    }}
                  >
                    <div
                      style={{
                        background: msg.senderId === localParticipant.identity ? "#007BFF" : "#444",
                        color: "white",
                        padding: "10px 15px",
                        borderRadius: "15px",
                        maxWidth: "75%",
                        alignSelf,
                        display: "inline-block",
                        textAlign: "left",
                        wordWrap: "break-word",
                      }}
                    >
                      <strong>{msg.senderName}: </strong> {msg.text}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#ddd",
                        marginTop: "5px",
                        textAlign: "right",
                      }}
                    >
                      {msg.time}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input */}
          <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #555" }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #777",
                borderRadius: "5px",
                outline: "none",
                background: "#222",
                color: "white",
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                marginLeft: "10px",
                background: "#007BFF",
                color: "white",
                padding: "8px 12px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;

