const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  avatar: { type: String },
  
  role: { 
    type: String, 
    enum: ['user', 'admin', 'moderator'], 
    default: 'user' 
  },
  
  // 👇 THIS SECTION IS MISSING IN YOUR CODE 👇
  notifications: [{
    message: String,
    type: { type: String, enum: ['invite'] },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  }],
  // 👆 ---------------------------------- 👆
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);