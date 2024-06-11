const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    supportRoleId: { type: String, required: true },
});

module.exports = mongoose.model('ServerConfig', configSchema);