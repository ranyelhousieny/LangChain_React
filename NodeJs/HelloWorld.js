// Load environment variables from .env file
require('dotenv').config();

// Import the ChatOpenAI class from the LangChain OpenAI package
const { ChatOpenAI } = require("@langchain/openai");


// Create a new instance of ChatOpenAI with configuration
const chat = new ChatOpenAI({
  // Specify the model to use
  modelName: "gpt-4o-mini",
  // Use the API key from environment variables
  openAIApiKey: process.env.OPENAI_API_KEY
});

// Define an async function to fetch and display a joke
async function getJoke() {
  try {
    
    // Make an asynchronous call to the chat model asking for a joke
    const result = await chat.invoke("Tell me a joke");
    
    
    // Print the joke to the console
    console.log("Joke:", result.content);
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error:", error);
  }
}

getJoke();


