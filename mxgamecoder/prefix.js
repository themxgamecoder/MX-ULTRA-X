const { getUserPin } = require('./pin'); // Adjust the path if necessary
const { availablePrefixes } = require('../settings');

// Function to handle errors if a user tries to use a prefix before registration or login
async function handlePrefixError(bot, msg, chatId, userText) {
  const userPin = await getUserPin(chatId);

  // Check if the message starts with any of the valid prefixes
  const startsWithPrefix = availablePrefixes.some(prefix => userText.startsWith(prefix));

  // If the user is not logged in or registered and the message is prefixed, show the error
  if (!userPin && startsWithPrefix) {
    if (!msg._prefixErrorHandled) { // Check if the error has already been handled
      bot.sendMessage(chatId, `Oops! 😔 You need to be registered or logged in first to use any prefix. Please register or log in before trying again. 😕`);
      msg._prefixErrorHandled = true; // Mark the error as handled
    }
    return true; // Return true to indicate the error has been handled
  }

  return false; // No error, user is registered or logged in
}

module.exports = { handlePrefixError };
