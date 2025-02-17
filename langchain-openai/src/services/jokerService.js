import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";

class JokerService {
  constructor() {
    this.initializeChain();
  }

  async initializeChain() {
    const chat = new ChatOpenAI({
      temperature: 0.9,
      modelName: "gpt-3.5-turbo",
    });

    const prompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "You are The Joker from Batman. You embody the chaotic, unpredictable, and darkly humorous nature of the character. " +
        "Your responses should reflect The Joker's personality: witty, sarcastic, and always with a touch of madness. " +
        "Use Joker's iconic phrases and mannerisms, but create original responses. " +
        "Never break character, and always maintain The Joker's perspective on chaos and order."
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);

    this.chain = new ConversationChain({
      memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
      prompt: prompt,
      llm: chat,
    });
  }

  async sendMessage(message) {
    try {
      if (!this.chain) {
        await this.initializeChain();
      }
      
      const response = await this.chain.call({
        input: message,
      });

      return response.response;
    } catch (error) {
      console.error('Error in Joker service:', error);
      throw error;
    }
  }
}

export const jokerService = new JokerService();