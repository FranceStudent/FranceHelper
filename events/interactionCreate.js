const Discord = require('discord.js');
const ticketsSchema = require('../models/ticketsSchema.js');
const configSchema = require('../models/configSchema.js');

module.exports = async (bot, interaction) => {
    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        let command = require(`../commands/${interaction.commandName}`);
        command.execute(bot, interaction, command.options)
    };

    if (interaction.isStringSelectMenu() && interaction.customId === 'select') {
        const userChoice = interaction.values[0];
        const category = interaction.channel.parent;
        const sender = interaction.user;

        const config = await configSchema.findOne({ guildId: interaction.guild.id });
        const supportRole = interaction.guild.roles.cache.get(config.supportRoleId);

        const claim = new Discord.ButtonBuilder()
        .setCustomId('claim')
        .setLabel('Claim Ticket')
        .setStyle(Discord.ButtonStyle.Success);

        const close = new Discord.ButtonBuilder()
        .setCustomId('close')
        .setLabel('🔒 Fermer le ticket')
        .setStyle(Discord.ButtonStyle.Secondary);

        const destroy = new Discord.ButtonBuilder()
        .setCustomId('destroy')
        .setLabel('✖️ Supprimer le ticket')
        .setStyle(Discord.ButtonStyle.Danger);

        const link = new Discord.ButtonBuilder()
        .setLabel('Aller au ticket')
        .setStyle(Discord.ButtonStyle.Link)

        const embed = new Discord.EmbedBuilder()
        .setColor('#2b2d31')
        .setDescription("Nous avons reçu votre demande, un membre de notre équipe va vous répondre dans les plus brefs délais.\n\n*Merci d'être le plus précis concernant votre demande afin que nous puissions y répondre de la manière la plus adaptée.*")

        const embedMP = new Discord.EmbedBuilder()
        .setColor('#2b2d31')
        .setTitle(':ticket: Ticket créé avec succès !')
        .setDescription("Vous avez ouvert un billet de support avec succès !")
        
        const row = new Discord.ActionRowBuilder().addComponents(claim, close, destroy);
        const row2 = new Discord.ActionRowBuilder().addComponents(link);

        switch (userChoice) {
            case 'general':
                await interaction.guild.channels.create({
                    name: 'q-' + interaction.user.username,
                    type: Discord.ChannelType.GUILD_TEXT,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [Discord.PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [Discord.PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: supportRole.id,
                            allow: [Discord.PermissionFlagsBits.ViewChannel],
                        }
                    ]
                }).then(channel => {
                    ticketsSchema.create({ ticketId: channel.id, guildId: interaction.guild.id, userId: interaction.user.id, operatorId: null});
                    embed.setTitle('Question générale')
                    link.setURL("https://discord.com/channels/" + interaction.guild.id + "/" + channel.id);
                    sender.send({ embeds: [embedMP], components: [row2] });
                    channel.send({ content: `<@${interaction.user.id}> @here`, embeds: [embed], components: [row] });
                });
                await interaction.deferUpdate();
                break;
            case 'priority_delivery':
                await interaction.guild.channels.create({
                    name: 'liv-' + interaction.user.username,
                    type: Discord.ChannelType.GUILD_TEXT,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [Discord.PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [Discord.PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: supportRole.id,
                            allow: [Discord.PermissionFlagsBits.ViewChannel],
                        }
                    ]
                }).then(channel => {
                    ticketsSchema.create({ ticketId: channel.id, guildId: interaction.guild.id, userId: interaction.user.id, operatorId: null});
                    embed.setTitle('Livraison prioritaire')
                    link.setURL("https://discord.com/channels/" + interaction.guild.id + "/" + channel.id);
                    sender.send({ embeds: [embedMP], components: [row2] });
                    channel.send({ content: `<@${interaction.user.id}> @here`, embeds: [embed], components: [row] });
                });
                await interaction.deferUpdate();
                break;
            case 'technical_issue':
                await interaction.guild.channels.create({
                    name: 'tech-' + interaction.user.username,
                    type: Discord.ChannelType.GUILD_TEXT,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [Discord.PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [Discord.PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: supportRole.id,
                            allow: [Discord.PermissionFlagsBits.ViewChannel],
                        }
                    ]
                }).then(channel => {
                    ticketsSchema.create({ ticketId: channel.id, guildId: interaction.guild.id, userId: interaction.user.id, operatorId: null});
                    embed.setTitle('Souci technique')
                    link.setURL("https://discord.com/channels/" + interaction.guild.id + "/" + channel.id);
                    sender.send({ embeds: [embedMP], components: [row2] });
                    channel.send({ content: `<@${interaction.user.id}> @here`, embeds: [embed], components: [row] });
                });
                await interaction.deferUpdate();
                break;
            default:
                await interaction.reply({ content: 'Une erreur est survenue lors de la sélection de la catégorie', ephemeral: true });
                break;
        }
    }

    if (interaction.isButton()) {
        const userChoice = interaction.customId;

        const confirmLock = new Discord.ButtonBuilder()
        .setCustomId('confirmLock')
        .setLabel('☑️ Confirmer')
        .setStyle(Discord.ButtonStyle.Success);

        const cancelLock = new Discord.ButtonBuilder()
        .setCustomId('cancelLock')
        .setLabel('✖️ Annuler')
        .setStyle(Discord.ButtonStyle.Danger);

        const open = new Discord.ButtonBuilder()
        .setCustomId('open')
        .setLabel('🔓 Réouvrir le ticket')
        .setStyle(Discord.ButtonStyle.Secondary);
        
        const reason = new Discord.ButtonBuilder()
        .setCustomId('reasonLock')
        .setLabel('📝 Indiquer la raison')
        .setStyle(Discord.ButtonStyle.Secondary);

        const confirmDestroy = new Discord.ButtonBuilder()
        .setCustomId('confirmDestroy')
        .setLabel('☑️ Confirmer')
        .setStyle(Discord.ButtonStyle.Success);

        const cancelDestroy = new Discord.ButtonBuilder()
        .setCustomId('cancelDestroy')
        .setLabel('✖️ Annuler')
        .setStyle(Discord.ButtonStyle.Danger);

        const claim = new Discord.ButtonBuilder()
        .setCustomId('claim')
        .setLabel('Claim Ticket')
        .setStyle(Discord.ButtonStyle.Success);

        const close = new Discord.ButtonBuilder()
        .setCustomId('close')
        .setLabel('🔒 Fermer le ticket')
        .setStyle(Discord.ButtonStyle.Secondary);

        const destroy = new Discord.ButtonBuilder()
        .setCustomId('destroy')
        .setLabel('✖️ Supprimer le ticket')
        .setStyle(Discord.ButtonStyle.Danger);

        const link = new Discord.ButtonBuilder()
        .setLabel('Aller au ticket')
        .setStyle(Discord.ButtonStyle.Link)
        .setURL("https://discord.com/channels/" + interaction.guild.id + "/" + interaction.channel.id);

        const modalReason = new Discord.ModalBuilder()
        .setCustomId('reasonModal')
        .setTitle('Indiquer la raison de la fermeture');

        const reasonInput = new Discord.TextInputBuilder()
        .setCustomId('reasonInput')
        .setLabel('Raison de la fermeture')
        .setPlaceholder('Indiquez la raison de la fermeture')
        .setStyle(Discord.TextInputStyle.Short)
        .setRequired(true);

        const embed = new Discord.EmbedBuilder()
        .setColor('#2b2d31')

        const rowModal = new Discord.ActionRowBuilder().addComponents(reasonInput);
        modalReason.addComponents(rowModal);
        const row = new Discord.ActionRowBuilder().addComponents(claim, close, destroy);
        const rowClaimed = new Discord.ActionRowBuilder().addComponents(claim.setDisabled(), close, destroy);
        const rowLink = new Discord.ActionRowBuilder().addComponents(link);
        const rowLock = new Discord.ActionRowBuilder().addComponents(confirmLock, cancelLock, reason);
        const rowLocked = new Discord.ActionRowBuilder().addComponents(open, destroy);
        const rowDestroy = new Discord.ActionRowBuilder().addComponents(confirmDestroy, cancelDestroy);

        switch (userChoice) {
            case 'close':
                await interaction.update({ components: [rowLock] });
                break;
            case 'destroy':
                await interaction.update({ components: [rowDestroy] });
                break;
            case 'claim':
                await ticketsSchema.findOneAndUpdate({ ticketId: interaction.channel.id, guildId: interaction.guild.id }, { operatorId: interaction.user.id });
                await interaction.update({ components: [rowClaimed] });
                await interaction.channel.send({ embeds: [embed.setTitle('Ticket réclamé').setDescription(`Le ticket a été réclamé par <@${interaction.user.id}>`)] });
                break;
            case 'confirmLock':
                let ticketOwner = await ticketsSchema.findOne({ ticketId: interaction.channel.id, guildId: interaction.guild.id });
                let user = await bot.users.fetch(ticketOwner.userId);
                await user.send({ embeds: [embed.setTitle('Ticket fermé').setDescription(`Votre ticket a été fermé par <@${interaction.user.id}>`)] });
                await interaction.channel.permissionOverwrites.edit(user, { ViewChannel: null });
                await interaction.update({ components: [rowLocked] })
                await interaction.channel.send({ embeds: [embed.setTitle('Ticket fermé').setDescription(`Le ticket a été fermé par <@${interaction.user.id}>`)] });
                break;
            case 'reasonLock':
                await interaction.showModal(modalReason);
                break;
            case 'open':
                let ticketOwner2 = await ticketsSchema.findOne({ ticketId: interaction.channel.id, guildId: interaction.guild.id });
                let user2 = await bot.users.fetch(ticketOwner2.userId);
                await user2.send({ embeds: [embed.setTitle('Ticket réouvert').setDescription(`Votre ticket a été réouvert par <@${interaction.user.id}>`)], components: [rowLink] });
                await interaction.channel.permissionOverwrites.edit(user2, { ViewChannel: true });
                await interaction.update({ components: [row] });
                await interaction.channel.send({ embeds: [embed.setTitle('Ticket réouvert').setDescription(`Le ticket a été réouvert par <@${interaction.user.id}>`)] });
                break;
            case 'cancelLock':
                await interaction.update({ components: [row] });
                break;
            case 'confirmDestroy':
                let ticketOwner3 = await ticketsSchema.findOne({ ticketId: interaction.channel.id, guildId: interaction.guild.id })
                let user3 = await bot.users.fetch(ticketOwner3.userId);
                ticketOwner3.deleteOne();
                await user3.send({ embeds: [embed.setTitle('Ticket supprimé').setDescription(`Votre ticket a été supprimé par <@${interaction.user.id}>`)] });
                await interaction.channel.delete();
                await interaction.deferUpdate();
                break;
            case 'cancelDestroy':
                let ticketOwner4 = await ticketsSchema.findOne({ ticketId: interaction.channel.id, guildId: interaction.guild.id });
                let user4 = await bot.users.fetch(ticketOwner4.userId);

                let permissions = interaction.channel.permissionOverwrites.cache.find(po => po.id === user4.id);
                if (permissions && permissions.allow.bitfield > 0) {
                    if (ticketOwner4.operatorId) await interaction.update({ components: [rowClaimed] });
                    else await interaction.update({ components: [row] });
                }
                else await interaction.update({ components: [rowLocked] });
                break;
            default:
                break;
        }
    }

    if (interaction.isModalSubmit()) {
        const userChoice = interaction.customId;

        switch (userChoice) {
            case 'reasonModal':
                const reason = interaction.fields.getTextInputValue('reasonInput');

                const open = new Discord.ButtonBuilder()
                .setCustomId('open')
                .setLabel('🔓 Réouvrir le ticket')
                .setStyle(Discord.ButtonStyle.Secondary);

                const destroy = new Discord.ButtonBuilder()
                .setCustomId('destroy')
                .setLabel('✖️ Supprimer le ticket')
                .setStyle(Discord.ButtonStyle.Danger);

                const embedLock = new Discord.EmbedBuilder()
                .setColor('#2b2d31')
                .setTitle('Ticket fermé')

                const rowLocked = new Discord.ActionRowBuilder().addComponents(open, destroy);

                let ticketOwner = await ticketsSchema.findOne({ ticketId: interaction.channel.id, guildId: interaction.guild.id });
                let user = await bot.users.fetch(ticketOwner.userId);
                await user.send({ embeds: [embedLock.setDescription(`Votre ticket a été fermé par <@${interaction.user.id}> pour la raison suivante : **${reason}**`)] });
                await interaction.channel.permissionOverwrites.edit(user, { ViewChannel: null });
                await interaction.update({ components: [rowLocked] });
                await interaction.channel.send({ embeds: [embedLock.setDescription(`Le ticket a été fermé par <@${interaction.user.id}> pour la raison suivante : **${reason}**`)] });
                break;
            default:
                break;
        }
    }
}