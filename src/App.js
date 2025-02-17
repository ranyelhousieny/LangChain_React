import { useState } from 'react';
import { ChatOpenAI } from "@langchain/openai";
import logo from './logo.svg';
import './App.css';

function App() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskJoke = async () => {
    try {
      setLoading(true);
      const chat = new ChatOpenAI({ 
        modelName: "gpt-4o-mini",
        openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY
      });
      
      const result = await chat.invoke("Tell me a joke");
      setResponse(result.content);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Welcome to LangChain.js Tutorial!
        </h1>
        <button 
          onClick={handleAskJoke}
          disabled={loading}
          className="App-link"
          style={{ 
            padding: '10px 20px',
            fontSize: '16px',
            cursor: loading ? 'wait' : 'pointer',
            margin: '20px 0'
          }}
        >
          {loading ? 'Getting a joke...' : 'Tell me a joke!'}
        </button>
        {response && (
          <div style={{ 
            maxWidth: '600px',
            margin: '20px',
            padding: '20px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px'
          }}>
            {response}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
