import React from 'react';

const ChatMessages = ({ messages }) => {
  return (
    <div className="chat-messages">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
        >
          <div className="message-content">{message.content}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;