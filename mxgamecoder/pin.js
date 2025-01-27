const mongoose = require('mongoose');

// Define schema for user PIN
const pinSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Each userId must be unique
  pin: { type: String, required: true, unique: true } // PINs must be unique
});

// Create a model based on the schema
const Pin = mongoose.model('Pin', pinSchema);

/**
 * Function to save the PIN
 * @param {String} userId - The user's Telegram ID
 * @param {String} pin - The PIN to be saved
 * @returns {Object} - { success: Boolean, message: String }
 */
async function savePin(userId, pin) {
  try {
    const existingPin = await Pin.findOne({ userId });
    if (existingPin) {
      // Update the existing PIN
      existingPin.pin = pin;
      await existingPin.save();
    } else {
      // Create a new PIN record
      const newPin = new Pin({ userId, pin });
      await newPin.save();
    }
    return { success: true, message: 'PIN saved successfully! 🎉' };
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.pin) {
      // Handle duplicate PIN error
      console.error('Error: Duplicate PIN detected:', pin);
      return { success: false, message: 'Oops! That PIN is already in use. Please choose a different one. 😊' };
    } else {
      // Handle generic errors
      console.error('Error saving PIN:', error);
      return { success: false, message: 'Sorry, there was an issue saving your PIN. Please try again later. 😢' };
    }
  }
}

/**
 * Function to validate the PIN format
 * @param {String} pin - The PIN to validate
 * @returns {Boolean} - True if valid, otherwise false
 */
function validatePin(pin) {
  return /^[0-9]{7}$/.test(pin); // Must be exactly 7 digits
}

/**
 * Function to get the user's PIN from the database
 * @param {String} userId - The user's Telegram ID
 * @returns {String|null} - The user's PIN, or null if not found
 */
async function getUserPin(userId) {
  try {
    const userPin = await Pin.findOne({ userId });
    return userPin ? userPin.pin : null; // Return the PIN if found, or null if not
  } catch (error) {
    console.error('Error retrieving PIN:', error);
    return null;
  }
}

module.exports = { savePin, validatePin, getUserPin }