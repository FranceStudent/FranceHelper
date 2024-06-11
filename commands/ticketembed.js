const Discord = require('discord.js');

module.exports = {
    name: 'ticketembed',
    description: 'Crée un embed pour créer des tickets',
    dm: false,
    permission: Discord.PermissionFlagsBits.Administrator,

    async execute(bot, interaction) {
        try {
            let embed = new Discord.EmbedBuilder()
                .setTitle('Choisissez une catégorie')
                .setDescription(`Sélectionnez le bon département au sein de la liste déroulante.`)
                .setColor('#2b2d31')
                .addFields(
                    { name: '\u200B', value: `__Catégories disponibles :__` },
                    { name: '❓ Questions générales', value: `Nous répondrons à toutes vos questions.` },
                    { name: '🚚 Livraison prioritaire', value: `Bénéficiez d'une livraison accélérée grâce au Premium !` },
                    { name: '🛠️ Souci technique', value: `Vous rencontrez un problème technique ?` },
                )
                .setThumbnail('https://cdn.discordapp.com/attachments/925117398653235232/1240050296164712449/croppedimage-6622c031b5784b56b45dc30a1f1fe6c5.png?ex=66452655&is=6643d4d5&hm=495d143e41032cd375305779f5979003c919e1533c2194ee1b665a0d9e53c32d&');

            const selectMenu = new Discord.StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Choisissez une catégorie')
                .addOptions([
                    {
                        label: 'Questions générales',
                        description: 'Nous répondrons à toutes vos questions.',
                        value: 'general',
                    },
                    {
                        label: 'Livraison prioritaire',
                        description: 'Bénéficiez d\'une livraison accélérée grâce au Premium !',
                        value: 'priority_delivery',
                    },
                    {
                        label: 'Souci technique',
                        description: 'Vous rencontrez un problème technique ?',
                        value: 'technical_issue',
                    },
                ]);

            const row = new Discord.ActionRowBuilder().addComponents(selectMenu);

            await interaction.channel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: 'Embed créé avec succès !', ephemeral: true });
        } catch (error) {
            let embed = new Discord.EmbedBuilder()
                .setColor('Red')
                .setDescription('Une erreur est survenue lors de la création de l\'embed\n' + error);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}