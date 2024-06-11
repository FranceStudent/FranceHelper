const Discord = require('discord.js');
const config = require('../config.js');

module.exports = {
    name: 'verif',
    description: 'Récupère l\'état de vérification d\'un utilisateur',
    dm: true,
    permission: Discord.PermissionFlagsBits.ManageMessages,
    options: [
        {
            type: 'integer',
            name: 'userid',
            description: 'Utilisateur à vérifier',
            required: true
        }
    ],
    
    async execute(bot, interaction) {
        try {
            let params = new URLSearchParams({
                userId: interaction.options.getInteger('userid')
            });

            let response = await fetch(config.api_student, {
                method: 'POST',
                body: params
            });

            let data = await response.text();
            let verificationStatus = JSON.parse(data);
            let embed = new Discord.EmbedBuilder()
                .setTitle(`Vérification étudiante - ID ${interaction.options.getInteger('userid')}`)
                .setImage('https://media.discordapp.net/attachments/925117398653235232/1238132772212707449/banner.png?ex=663e2c80&is=663cdb00&hm=420d0807717a4d081e1be00544420d73c7a137ff5dc5f2c0b7fc118904ebde13&=&format=webp&quality=lossless&width=1440&height=209')
                .setTimestamp()
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL() });

            if (verificationStatus.status === "success") {
                let user = verificationStatus.user;
                    if (user.verified) {
                        embed.setColor('Green')
                            .addFields({name: 'Statut', value: 'Approuvé'})
                    } else if (user.verified === 0) {
                        embed.setColor('Red')
                            .addFields(
                                {name: 'Statut', value: 'Rejeté', inline: true},
                                user.reason ? {name: 'Raison', value: user.reason, inline: true} : {name: 'Raison', value: 'Aucune raison donnée', inline: true}
                            )
                    } else {
                        embed.setColor('Yellow')
                            .addFields({name: 'Statut', value: 'En attente de vérification'})
                    }
            } else {
                embed.setColor('Red')
                    .addFields({name: 'Statut', value: 'Aucune demande soumise'})
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            let embed = new Discord.EmbedBuilder()
                .setColor('Red')
                .setDescription('An error occurred while fetching your verification status.');
            await interaction.reply({ embeds: [embed] });
        }
    }
}