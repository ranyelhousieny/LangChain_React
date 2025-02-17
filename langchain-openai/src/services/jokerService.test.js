import { jokerService } from './jokerService';
import { ChatOpenAI } from "@langchain/openai";

// Mock ChatOpenAI
jest.mock("@langchain/openai", () => ({
  ChatOpenAI: jest.fn().mockImplementation(() => ({
    invoke: jest.fn().mockResolvedValue({ content: "Ha ha ha! Test response!" })
  }))
}));

describe('JokerService', () => {
  const mockApiKey = 'test-api-key';
  const mockMessage = 'Hello Joker';

  beforeEach(() => {
    // Reset the service state before each test
    jokerService.messages = [];
    jokerService.apiKey = null;
    jokerService.chat = null;
    ChatOpenAI.mockClear();
  });

  describe('initializeChat', () => {
    it('throws error if API key is not provided', () => {
      expect(() => jokerService.initializeChat()).toThrow('API key is required');
    });

    it('initializes chat with correct configuration', () => {
      jokerService.initializeChat(mockApiKey);
      
      expect(ChatOpenAI).toHaveBeenCalledWith({
        temperature: 0.9,
        modelName: "gpt-4-1106-preview",
        openAIApiKey: mockApiKey
      });
    });

    it('sets system message correctly', () => {
      jokerService.initializeChat(mockApiKey);
      
      expect(jokerService.messages[0].role).toBe('system');
      expect(jokerService.messages[0].content).toContain('You are The Joker from Batman');
    });
  });

  describe('sendMessage', () => {
    it('throws error for empty messages', async () => {
      await expect(jokerService.sendMessage('', mockApiKey)).rejects.toThrow('Message is required');
      await expect(jokerService.sendMessage('   ', mockApiKey)).rejects.toThrow('Message is required');
    });

    it('initializes chat if not initialized', async () => {
      await jokerService.sendMessage(mockMessage, mockApiKey);
      
      expect(ChatOpenAI).toHaveBeenCalled();
    });

    it('adds messages to conversation history', async () => {
      await jokerService.sendMessage(mockMessage, mockApiKey);
      
      const history = jokerService.getConversationHistory();
      expect(history).toHaveLength(2); // User message and response
      expect(history[0].content).toBe(mockMessage);
      expect(history[1].content).toBe("Ha ha ha! Test response!");
    });

    it('reinitializes chat if API key changes', async () => {
      await jokerService.sendMessage(mockMessage, 'key1');
      await jokerService.sendMessage(mockMessage, 'key2');
      
      expect(ChatOpenAI).toHaveBeenCalledTimes(2);
    });
  });

  describe('conversation management', () => {
    it('clears conversation history correctly', async () => {
      await jokerService.sendMessage(mockMessage, mockApiKey);
      jokerService.clearConversation();
      
      expect(jokerService.getConversationHistory()).toHaveLength(0);
      expect(jokerService.messages).toHaveLength(1); // System message remains
    });

    it('maintains conversation history across messages', async () => {
      await jokerService.sendMessage('message 1', mockApiKey);
      await jokerService.sendMessage('message 2', mockApiKey);
      
      const history = jokerService.getConversationHistory();
      expect(history).toHaveLength(4); // Two messages and two responses
    });
  });
});