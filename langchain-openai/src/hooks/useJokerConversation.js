import { useState } from 'react';
import { jokerService } from '../services/jokerService';

export const useJokerConversation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message) => {
    try {
      setIsLoading(true);
      const response = await jokerService.sendMessage(message);
      return response;
    } catch (error) {
      console.error('Error in Joker conversation:', error);
      return 'Ha ha ha! Something went wrong with our little chat. Why so serious?';
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading
  };
};