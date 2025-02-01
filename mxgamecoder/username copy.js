const mongoose = require('mongoose');

// Define schema for user data
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true }
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Function to save username
async function saveUsername(userId, username) {
  try {
    const user = await User.findOne({ userId });
    if (user) {
      // Update existing user's username
      user.username = username;
      await user.save();
    } else {
      // Create a new user if not found
      const newUser = new User({ userId, username });
      await newUser.save();
    }
    return true;
  } catch (error) {
    console.error('Error saving username:', error); // Detailed error logs
    return false;
  }
}

// Function to check if the username already exists
async function checkUsernameExists(username) {
  try {
    const user = await User.findOne({ username });
    return user !== null; // Returns true if the username exists, false otherwise
  } catch (error) {
    console.error('Error checking username:', error);
    return false; // In case of an error, return false to allow registration
  }
}

// Function to get username by userId
async function getUsername(userId) {
  try {
    const user = await User.findOne({ userId });
    return user ? user.username : null;
  } catch (error) {
    console.error('Error getting username:', error);
    return null;
  }
}

module.exports = { saveUsername, getUsername, checkUsernameExists };
