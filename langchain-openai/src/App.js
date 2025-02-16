import React, { useState } from "react";
import { Button, TextField, Typography, Container, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

function App() {
  const [apiKey, setApiKey] = useState(""); // Stores OpenAI API key
  const [joke, setJoke] = useState(""); // Stores AI-generated joke
  const [topic, setTopic] = useState("programming"); // Topic for the joke
  const [style, setStyle] = useState("dad-joke"); // Style of the joke

  // Handle API key input
  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  // Handle topic selection
  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  // Handle style selection
  const handleStyleChange = (event) => {
    setStyle(event.target.value);
  };

  // Call OpenAI using LangChain with Prompt Templates
  const handleTellJoke = async () => {
    if (!apiKey) {
      alert("Please enter your OpenAI API key.");
      return;
    }

    const model = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-4",
    });

    // Create a prompt template
    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", "You are a comedian specialized in {style}. Keep jokes clean and family-friendly."],
      ["user", "Tell me a {style} about {topic}. Make it short and punchy."]
    ]);

    try {
      // Format the prompt with our variables
      const formattedPrompt = await promptTemplate.formatMessages({
        style: style,
        topic: topic
      });

      // Send the formatted prompt to the model
      const response = await model.invoke(formattedPrompt);
      setJoke(response.content);
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      setJoke("Failed to get a joke. Check API key.");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        LangChain Prompt Template Joke Generator 🤖
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Using prompt templates to generate customized jokes
      </Typography>

      {/* Joke Configuration */}
      <Box marginBottom="20px" display="flex" gap={2}>
        <FormControl fullWidth>
          <InputLabel>Topic</InputLabel>
          <Select
            value={topic}
            label="Topic"
            onChange={handleTopicChange}
          >
            <MenuItem value="programming">Programming</MenuItem>
            <MenuItem value="food">Food</MenuItem>
            <MenuItem value="animals">Animals</MenuItem>
            <MenuItem value="sports">Sports</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Style</InputLabel>
          <Select
            value={style}
            label="Style"
            onChange={handleStyleChange}
          >
            <MenuItem value="dad-joke">Dad Joke</MenuItem>
            <MenuItem value="pun">Pun</MenuItem>
            <MenuItem value="one-liner">One-liner</MenuItem>
            <MenuItem value="knock-knock">Knock-knock</MenuItem>
          </Select>
        </FormControl>
      </Box>

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
