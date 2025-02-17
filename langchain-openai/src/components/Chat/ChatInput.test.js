import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatInput from './ChatInput';

describe('ChatInput', () => {
  const mockOnSendMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input field and send button', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('handles message sending correctly', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
    expect(input.value).toBe(''); // Input should be cleared after sending
  });

  it('disables input and shows loading state when isLoading is true', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={true} />);
    
    expect(screen.getByPlaceholderText('Type your message...')).toBeDisabled();
    expect(screen.getByText('Sending...')).toBeInTheDocument();
  });

  it('prevents sending empty messages', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    
    const sendButton = screen.getByText('Send');
    fireEvent.click(sendButton);

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('prevents sending messages while loading', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={true} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByText('Sending...');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });
});