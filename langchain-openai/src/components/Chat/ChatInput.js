import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading || !message.trim()}>
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

export default ChatInput;