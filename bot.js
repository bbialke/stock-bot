const Discord = require('discord.js');
const {RichEmbed} = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
const chalk = require('chalk');
const moment = require('moment');
require('./util/eventLoader')(client)

const config = require("./config.json");


//Informs user when bot is ready to recieve commands
client.on('ready', () => {
  client.user.setActivity('Stonks')
  console.log(chalk.green('Connected'));
	console.log(chalk.green('Logged in as: '));
	console.log(chalk.green(client.user.tag + ' - (' + client.user + ')'));
});

//logging funtion using momentjs
const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

//command loader
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  log(`Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    const props = require(`./commands/${f}`);
    log(`Loading Command: ${props.help.name}... Success`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

//client reloader
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      const cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  /* This function should resolve to an ELEVATION level which
     is then sent to the command handler for verification*/
  let permlvl = 0;
  if (message.author.id === '405201625699844107') permlvl = 2;
  if (message.author.id === '378432572155363329') permlvl = 2;
  if (message.author.id === '380864512292814849') permlvl = 4;
  if (message.author.id === '329305183437717504') permlvl = 4;
  if (message.author.id === '278633335948050432') permlvl = 4;
  if (message.author.id === '380864512292814849') permlvl = 5;
  return permlvl;
};

client.login(config.token);
