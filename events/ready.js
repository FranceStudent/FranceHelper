const Discord = require('discord.js');
const chalk = require('chalk');
const loadSlashCommands = require('../loaders/loadSlashCommands');
const loadStocks = require('../loaders/loadStocks');
const stockSchema = require('../models/stockSchema');

module.exports = async bot => {

    await loadSlashCommands(bot);

    bot.user.setActivity({
        type: Discord.ActivityType.Custom,
        name: 'customstatus',
        state: '✨ discord.gg/francestudent',
    })

    console.log(chalk.green(`Logged in as ${bot.user.tag}!`));
}