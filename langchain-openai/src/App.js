import React, { useState } from "react";
import { Button, TextField, Typography, Container, Box } from "@mui/material";
import { ChatOpenAI } from "@langchain/openai";

function App() {
  const [apiKey, setApiKey] = useState(""); // Stores OpenAI API key
  const [joke, setJoke] = useState(""); // Stores AI-generated joke

  // Handle API key input
  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  // Call OpenAI using LangChain
  const handleTellJoke = async () => {
    if (!apiKey) {
      alert("Please enter your OpenAI API key.");
      return;
    }

    const model = new ChatOpenAI({
      openAIApiKey: apiKey, // Provide the API key
      modelName: "gpt-4", // Choose model
    });

    try {
      const response = await model.invoke([
        { role: "system", content: "You are a funny comedian. Keep jokes clean and family-friendly." },
        { role: "user", content: "Tell me a funny joke." }
      ]);
      setJoke(response.content); // Display the AI-generated joke
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      setJoke("Failed to get a joke. Check API key.");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        LangChain Joke Generator 🤖
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

      {/* Joke Button */}
      <Button variant="contained" color="primary" onClick={handleTellJoke} fullWidth>
        Tell Me a Joke
      </Button>

      {/* Display Joke */}
      {joke && (
        <Box marginTop="20px">
          <Typography variant="h6">Generated Joke:</Typography>
          <Typography variant="body1">{joke}</Typography>
        </Box>
      )}
    </Container>
  );
}

export default App;
