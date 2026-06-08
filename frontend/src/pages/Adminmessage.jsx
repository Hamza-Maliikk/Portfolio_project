import React from 'react'
import { io } from "socket.io-client";

const API = `${import.meta.env.VITE_URL_API}api/messages`;
const socket = io(`${import.meta.env.VITE_URL_API}`);

const Adminmessage = () => {
    const [messages, setMessages] = React.useState([]);
    const [replies, setReplies] = React.useState({}); // har message ka reply track karo

    React.useEffect(() => {
        // Purane messages load karo
        fetch(API, { credentials: 'omit' })
          .then((res) => res.json())
          .then((data) => setMessages(data))
          .catch((err) => console.error("Error fetching messages:", err));

        // Admin room join karo
        socket.emit("join-admin");

        // Real-time naye messages suno
        socket.on("receive-message", (data) => {
            setMessages(prev => [...prev, data]);
        });

        return () => {
            socket.off("receive-message");
        };
    }, []);

    // Reply send karo
    const sendReply = (msg) => {
        const replyText = replies[msg.userId || msg._id];
        if (!replyText?.trim()) return;

        socket.emit("admin-reply", {
          userId: msg.userId,  // us specific user ko bhejo
          text: replyText,
          sender: "admin"
        });

        setReplies(prev => ({ ...prev, [msg.userId || msg._id]: "" })); // input clear
    };

  return (
    <div>
      <h1>Admin Messages</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {messages.map((msg, i) => (
          <li key={msg._id || i} style={{ marginBottom: "15px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
            <strong>{msg.name}:</strong> {msg.message || msg.text}

            {/* Reply input */}
            <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Reply likhao..."
                value={replies[msg.userId || msg._id] || ""}
                onChange={(e) =>
                  setReplies(prev => ({
                    ...prev,
                    [msg.userId || msg._id]: e.target.value
                  }))
                }
              />
              <button onClick={() => sendReply(msg)}>Send</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Adminmessage