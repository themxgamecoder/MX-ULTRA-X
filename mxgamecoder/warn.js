const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const warnSchema = new Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Warn = mongoose.model('Warn', warnSchema);

module.exports = Warn;