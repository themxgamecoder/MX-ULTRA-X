const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const adminSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = { Admin };