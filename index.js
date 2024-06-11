const Discord = require('discord.js');
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({intents});
const config = require('./config.js');
const mongoose = require('mongoose');
const chalk = require('chalk');
const loadCommands = require('./loaders/loadCommands.js');
const loadEvents = require('./loaders/loadEvents.js');

bot.commands = new Discord.Collection();

mongoose.connect(config.mongoURI)
    .then(() => {
        console.log(chalk.green('Connected to MongoDB'));
    })
    .catch((err) => {
        console.log(chalk.red(err));
    });

bot.login(config.token);
loadCommands(bot);
loadEvents(bot);