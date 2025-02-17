import React, { useState } from "react";
import { TextField, Typography, Container, Box } from "@mui/material";
import JokerChat from './components/Joker/JokerChat';

function App() {
  const [apiKey, setApiKey] = useState("");

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        The Joker's Chat Room 🃏
      </Typography>

      {/* API Key Input */}
      <Box marginBottom="20px">
        <Typography variant="h6">OpenAI API Key:</Typography>
        <TextField
          fullWidth
          type="password"
          placeholder="Enter your API key"
          value={apiKey}
          onChange={handleApiKeyChange}
        />
      </Box>

      {/* Joker Chat Component */}
      {apiKey ? (
        <JokerChat apiKey={apiKey} />
      ) : (
        <Typography variant="body1" align="center">
          Enter your API key to start chatting with The Joker
        </Typography>
      )}
    </Container>
  );
}

export default App;
