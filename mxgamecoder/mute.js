const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const muteSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  muteEnd: { type: Date, required: true }
});

const Mute = mongoose.model('Mute', muteSchema);

module.exports = Mute;
