import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JokerChat from './JokerChat';
import { useJokerConversation } from '../../hooks/useJokerConversation';

// Mock the hook
jest.mock('../../hooks/useJokerConversation');

describe('JokerChat', () => {
  const mockSendMessage = jest.fn();
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    useJokerConversation.mockReturnValue({
      sendMessage: mockSendMessage,
      isLoading: false
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders chat interface correctly', () => {
    render(<JokerChat apiKey={mockApiKey} />);
    
    expect(screen.getByText('Chat with The Joker')).toBeInTheDocument();
    expect(screen.getByText("Why so serious? Let's put a smile on that face!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });

  it('handles message sending correctly', async () => {
    mockSendMessage.mockResolvedValueOnce("Ha ha ha! That's a good one!");
    
    render(<JokerChat apiKey={mockApiKey} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello Joker' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('Hello Joker');
      expect(screen.getByText('Hello Joker')).toBeInTheDocument();
      expect(screen.getByText("Ha ha ha! That's a good one!")).toBeInTheDocument();
    });
  });

  it('shows loading state while sending message', async () => {
    mockSendMessage.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<JokerChat apiKey={mockApiKey} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello Joker' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Sending...')).toBeInTheDocument();
  });

  it('requires API key to be provided', () => {
    expect(() => render(<JokerChat />)).toThrow();
  });
});