const mongoose = require('mongoose');

// Admin schema
const adminSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
});

const Admin = mongoose.model('Admin', adminSchema);

// Ban schema
const banSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  // Add other fields if necessary
});

const Ban = mongoose.model('Ban', banSchema);

module.exports = { Admin, Ban };
