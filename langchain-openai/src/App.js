import React, { useState, useEffect } from "react";
import { 
  Button, TextField, Typography, Container, Box, 
  Select, MenuItem, FormControl, InputLabel,
  List, ListItem, ListItemText, Paper 
} from "@mui/material";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { BufferMemory } from "langchain/memory";

function App() {
  // State variables
  const [apiKey, setApiKey] = useState(""); // Stores OpenAI API key
  const [joke, setJoke] = useState(""); // Stores AI-generated joke
  const [topic, setTopic] = useState("programming"); // Topic for the joke
  const [style, setStyle] = useState("dad-joke"); // Style of the joke
  const [previousJokes, setPreviousJokes] = useState([]); // Store previous jokes
  const [chain, setChain] = useState(null); // Store the LLM chain with memory

  // Initialize chain with memory when API key is set
  useEffect(() => {
    if (apiKey) {
      const model = new ChatOpenAI({
        openAIApiKey: apiKey,
        modelName: "gpt-3.5-turbo", // Using a known working model
        temperature: 0.9,
      });

      // Create a prompt template that includes memory context
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a comedian specialized in {style}. Keep jokes clean and family-friendly."],
        new MessagesPlaceholder("history"),
        ["human", "Tell me a {style} about {topic}. Make it unique and different from our previous jokes."]
      ]);

      // Initialize memory
      const memory = new BufferMemory({
        returnMessages: true,
        memoryKey: "history",
        inputKey: "input",
      });

      // Create chain
      const chain = RunnableSequence.from([
        {
          input: (input) => input.input,
          history: async () => memory.loadMemoryVariables({}).then(vars => vars.history || []),
          style: (input) => input.style,
          topic: (input) => input.topic,
        },
        prompt,
        model,
      ]);

      setChain({ chain, memory });
    }
  }, [apiKey]);

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

  // Generate a new joke using LLM chain with memory
  const handleTellJoke = async () => {
    if (!apiKey || !chain) {
      alert("Please enter your OpenAI API key.");
      return;
    }

    try {
      const input = {
        style: style,
        topic: topic,
        input: `Generate a new ${style} about ${topic}`,
      };

      const response = await chain.chain.invoke(input);
      const newJoke = response.content;

      // Store in memory
      await chain.memory.saveContext(
        { input: input.input },
        { output: newJoke }
      );

      setJoke(newJoke);
      setPreviousJokes(prev => [...prev, newJoke]);
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      setJoke("Failed to get a joke. Check API key.");
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
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

      {/* Display Current Joke */}
      {joke && (
        <Box marginTop="20px">
          <Typography variant="h6">Latest Generated Joke:</Typography>
          <Paper elevation={3} style={{ padding: '15px', marginTop: '10px' }}>
            <Typography variant="body1">{joke}</Typography>
          </Paper>
        </Box>
      )}

      {/* Display Previous Jokes */}
      {previousJokes.length > 0 && (
        <Box marginTop="20px">
          <Typography variant="h6">Previous Jokes:</Typography>
          <Paper elevation={2} style={{ maxHeight: '200px', overflow: 'auto', marginTop: '10px' }}>
            <List>
              {previousJokes.slice(0, -1).reverse().map((prevJoke, index) => (
                <ListItem key={index} divider>
                  <ListItemText 
                    primary={prevJoke}
                    secondary={`Joke #${previousJokes.length - 1 - index}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      )}
    </Container>
  );
}

export default App;
