const Discord = require('discord.js');

module.exports = {
    name: 'dm',
    description: 'Envoie un message privé à l\'utilisateur',
    dm: true,
    permission: Discord.PermissionFlagsBits.ManageMessages,
    options: [
        {
            type: 'user',
            name: 'user',
            description: 'Utilisateur à contacter',
            required: true
        },
        {
            type: 'string',
            name: 'message',
            description: 'Message à envoyer',
            required: true
        }
    ],
    
    async execute(bot, interaction) {
        try {
            const user = interaction.options.getUser('user');

            const embed = new Discord.EmbedBuilder()
            .setTitle('Nouveau message de la part du staff')
            .setDescription('> '+ interaction.options.getString('message'))
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL() })
            .setTimestamp()
            .setColor('#1d66ec');

            await user.send({ embeds: [embed] });
            await interaction.reply({ content: 'Message envoyé avec succès', ephemeral: true });
        } catch (error) {
            let embed = new Discord.EmbedBuilder()
                .setColor('Red')
                .setDescription('Une erreur est survenue lors de l\'envoi du message')
            await interaction.reply({ embeds: [embed], ephemeral: true});
        }
        
    }
}