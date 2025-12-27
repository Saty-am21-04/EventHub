// backend/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date, // Using Date type allows for better sorting/filtering
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  // Adding category helps the AI make better recommendations
  category: {
    type: String,
    default: "General", 
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);