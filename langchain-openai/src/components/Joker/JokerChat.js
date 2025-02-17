import React, { useState } from 'react';
import { useJokerConversation } from '../../hooks/useJokerConversation';
import ChatInput from '../Chat/ChatInput';
import ChatMessages from '../Chat/ChatMessages';

const JokerChat = ({ apiKey }) => {
  const [messages, setMessages] = useState([]);
  const { sendMessage, isLoading } = useJokerConversation(apiKey);

  const handleSendMessage = async (message) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    const response = await sendMessage(message);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
  };

  return (
    <div className="joker-chat">
      <div className="chat-header">
        <h2>Chat with The Joker</h2>
        <p>Why so serious? Let's put a smile on that face!</p>
      </div>
      <ChatMessages messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default JokerChat;