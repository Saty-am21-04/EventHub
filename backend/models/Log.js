const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    adminEmail: String,
    action: String,
    target: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);