const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Affiche la latence',
    dm: true,
    
    async execute(bot, interaction) {
        await interaction.reply(`Ping : **${bot.ws.ping}ms**`);
    }
}