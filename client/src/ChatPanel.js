
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

export default function ChatPanel({ roomId, username }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('join-room', roomId, username);

    socket.on('receive-chat-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.off('receive-chat-message');
  }, [roomId, username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const chatMsg = {
      username,
      text: message,
      time: new Date().toLocaleTimeString()
    };

    socket.emit('send-chat-message', roomId, chatMsg);
    setMessages(prev => [...prev, chatMsg]);
    setMessage('');
  };

  return (
    <div style={{ width: '300px', borderLeft: '1px solid #ccc', padding: '10px', height: '100vh', overflowY: 'auto' }}>
      <h3>💬 Chat</h3>
      <div style={{ maxHeight: '80vh', overflowY: 'scroll' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '10px' }}>
            <strong>{msg.username}</strong> <small>{msg.time}</small>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ width: '80%' }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
