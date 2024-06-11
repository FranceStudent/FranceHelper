const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    stockInteractions: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('Stock', stockSchema);