const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    id: String, 
    eventId: String, 
    name: String,
    email: String,
    age: Number,
    type: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);