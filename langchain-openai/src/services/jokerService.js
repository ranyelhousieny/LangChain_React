import { ChatOpenAI } from "@langchain/openai";

class JokerService {
  constructor() {
    this.messages = [];
    this.apiKey = null;
  }

  initializeChat(apiKey) {
    if (!apiKey) {
      throw new Error('API key is required to initialize chat');
    }

    this.apiKey = apiKey;
    this.chat = new ChatOpenAI({
      temperature: 0.9,
      modelName: "gpt-4-1106-preview", // Using gpt-4-1106-preview as gpt-4-mini is not a valid model name
      openAIApiKey: apiKey
    });

    // Add the system message to set The Joker's personality
    this.messages = [{
      role: "system",
      content: "You are The Joker from Batman. You embody the chaotic, unpredictable, and darkly humorous nature of the character. " +
               "Your responses should reflect The Joker's personality: witty, sarcastic, and always with a touch of madness. " +
               "Use Joker's iconic phrases and mannerisms, but create original responses. " +
               "Never break character, and always maintain The Joker's perspective on chaos and order."
    }];
  }

  validateState() {
    if (!this.chat || !this.apiKey) {
      throw new Error('Chat not initialized. Call initializeChat with a valid API key first.');
    }
  }

  async sendMessage(message, apiKey) {
    try {
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        throw new Error('Message is required and must be a non-empty string');
      }

      if (!this.chat || this.apiKey !== apiKey) {
        this.initializeChat(apiKey);
      }

      this.validateState();

      // Add the user's message to the conversation
      this.messages.push({
        role: "user",
        content: message
      });
      
      // Get the response from the model
      const response = await this.chat.invoke(this.messages);

      // Add the assistant's response to the conversation history
      this.messages.push({
        role: "assistant",
        content: response.content
      });

      return response.content;
    } catch (error) {
      console.error('Error in Joker service:', error);
      throw error;
    }
  }

  // Method to clear conversation history
  clearConversation() {
    const systemMessage = this.messages[0];
    this.messages = [systemMessage];
  }

  // Method to get conversation history
  getConversationHistory() {
    return this.messages.slice(1); // Return all messages except the system message
  }
}

export const jokerService = new JokerService();