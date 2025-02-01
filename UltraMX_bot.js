const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const { handleUserInput } = require('./mxgamecoder/UltraMX_bot'); // Import functions
const Mute = require('./mxgamecoder/mute'); // Import Mute model
const { botName } = require('./settings'); // Import botName from settings
const pm2 = require('pm2'); // Import PM2 module
require('dotenv').config();

// Connect to MongoDB
const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully 😊'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Function to start the bot
function startBot() {
  const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

  // Handle user input (username and PIN)
  bot.on('message', async (msg) => {
    await handleUserInput(bot, msg); // Use handleUserInput from UltraMX_bot.js
  });

  // Function to check and remove expired mutes
  async function checkAndRemoveExpiredMutes() {
    const now = new Date();
    const expiredMutes = await Mute.find({ muteEnd: { $lt: now } });

    for (const mute of expiredMutes) {
      await bot.sendMessage(mute.userId, `🔊 *You have been automatically unmuted and can now send messages again.*\n\n👤 Bot Name: ${botName} 💖`);
      await Mute.deleteOne({ userId: mute.userId });
    }
  }

  // Run the mute checker every minute
  setInterval(checkAndRemoveExpiredMutes, 60000); // Pass bot instance to mute checker

  console.log('Bot instance started😎');
}

// Start PM2 and launch the bot as a process
pm2.connect((err) => {
  if (err) {
    console.error('PM2 connection error:', err);
    process.exit(2);
  }

  pm2.start({
    script: 'UltraMX_bot.js',
    name: 'mx-ultra-x-bot', // Name of the process
    exec_mode: 'fork', // PM2 exec mode
    max_memory_restart: '100M' // Auto-restart if process consumes more than 100MB
  }, (err, apps) => {
    pm2.disconnect(); // Disconnects from PM2
    if (err) throw err;
    
    startBot(); // Start the bot
  });
});
