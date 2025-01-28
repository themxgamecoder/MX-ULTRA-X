const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const { handleUserInput } = require('./mxgamecoder/UltraMX_bot.js'); // Import functions
require('dotenv').config();
// Get port from environment variables or default to 3000
const port = process.env.PORT || 3000;

// Connect to MongoDB
const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Create a new bot instance
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Handle user input (username and PIN)
bot.on('message', async (msg) => {
  await handleUserInput(bot, msg); // Use handleUserInput from UltraMX_bot.js
});

// Listen on the appropriate port for Render or local development
bot.listen(port, () => {
  console.log(`Server running on port ${port}`);
});