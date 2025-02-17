import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatOpenAI } from '@langchain/openai';
import { LLMChain } from 'langchain/chains';
import { BufferWindowMemory } from 'langchain/memory';
import App from './App';

// Mock the external dependencies
jest.mock('@langchain/openai');
jest.mock('langchain/chains');
jest.mock('langchain/memory');

describe('Joke Generator App', () => {
  const mockApiKey = 'test-api-key';
  const mockJoke = 'Why did the programmer quit his job? Because he didn\'t get arrays!';

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock the ChatOpenAI implementation
    ChatOpenAI.mockImplementation(() => ({
      modelName: 'gpt-4-mini',
      temperature: 0.9
    }));

    // Mock the LLMChain implementation
    LLMChain.mockImplementation(() => ({
      call: jest.fn().mockResolvedValue({ text: mockJoke })
    }));

    // Mock the BufferWindowMemory implementation
    BufferWindowMemory.mockImplementation(() => ({
      k: 5,
      returnMessages: true,
      memoryKey: 'history',
      inputKey: 'input'
    }));
  });

  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/LangChain Prompt Template Joke Generator/i)).toBeInTheDocument();
  });

  test('displays error when API key is not provided', async () => {
    const { getByText } = render(<App />);
    const generateButton = getByText(/Tell Me a Joke/i);

    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.click(generateButton);
    expect(alertMock).toHaveBeenCalledWith('Please enter your OpenAI API key.');

    alertMock.mockRestore();
  });

  test('successfully generates a joke', async () => {
    const { getByText, getByPlaceholderText } = render(<App />);

    // Enter API key
    const apiKeyInput = getByPlaceholderText(/Enter your API key/i);
    await userEvent.type(apiKeyInput, mockApiKey);

    // Click generate button
    const generateButton = getByText(/Tell Me a Joke/i);
    fireEvent.click(generateButton);

    // Wait for the joke to appear
    await waitFor(() => {
      expect(screen.getByText(mockJoke)).toBeInTheDocument();
    });
  });

  test('maintains list of previous jokes', async () => {
    const { getByText, getByPlaceholderText } = render(<App />);

    // Enter API key
    const apiKeyInput = getByPlaceholderText(/Enter your API key/i);
    await userEvent.type(apiKeyInput, mockApiKey);

    // Generate multiple jokes
    const generateButton = getByText(/Tell Me a Joke/i);
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(mockJoke)).toBeInTheDocument();
    });

    // Check if the joke is added to previous jokes
    expect(screen.getByText(/Previous Jokes:/i)).toBeInTheDocument();
  });

  test('changes joke style and topic', async () => {
    const { getByText, getByLabelText } = render(<App />);

    // Change style
    const styleSelect = getByLabelText(/Style/i);
    fireEvent.change(styleSelect, { target: { value: 'pun' } });
    expect(styleSelect.value).toBe('pun');

    // Change topic
    const topicSelect = getByLabelText(/Topic/i);
    fireEvent.change(topicSelect, { target: { value: 'food' } });
    expect(topicSelect.value).toBe('food');
  });
});
