const Discord = require('discord.js');
const configSchema = require('../models/configSchema.js');

module.exports = {
    name: 'setsupport',
    description: 'Définir le rôle de support',
    dm: false,
    permission: Discord.PermissionFlagsBits.Administrator,
    options: [
        {
            type: 'role',
            name: 'role',
            description: 'Rôle de support',
            required: true
        }
    ],
    
    async execute(bot, interaction) {
        const supportRole = interaction.options.getRole('role');

        const embed = new Discord.EmbedBuilder()
        .setTitle('Modification effectuée')
        .setColor('Green')
        .setDescription(`Le rôle de support a été défini sur ${supportRole}`)
        .setThumbnail(bot.user.displayAvatarURL())
        .setTimestamp();
        
        await configSchema.findOneAndUpdate({ guildId: interaction.guild.id }, { supportRoleId: supportRole.id }, { upsert: true });
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}