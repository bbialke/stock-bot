/*
The HELP command is used to display every command's name and description
to the user, so that he may see what commands are available. The help
command is also filtered by level, so if a user does not have access to
a command, it is not shown to them. If a command name is given with the
help command, its extended help is shown.
*/
const config = require('../config.json');
exports.run = (client, message, args, level) => {
  //const logo = client.emojis.find("name", "iconAI");
  const perms = client.elevation(message);
  console.log(args)
  // If no specific command is called, show all filtered commands.
  if (args.length !== 2) {
    // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
    const perms = client.elevation(message);
    const myCommands = message.guild ? client.commands.filter(cmd => cmd.conf.permLevel <= perms) : client.commands.filter(cmd => cmd.conf.permLevel <= perms &&  cmd.conf.guildOnly !== true);

    // Here we have to get the command names only, and we use that array to get the longest name.
    // This make the help commands "aligned" in the output.
    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = "";
    let output = `= Command List =\n\n[Use ${config.prefix}help <commandname> for details]\n`;
    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    sorted.forEach( c => {
      const cat = c.help.category;
      if (currentCategory !== cat) {
        output += `\u200b\n== ${cat} ==\n`;
        currentCategory = cat;
      }
      output += `${config.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });
    //message.react(logo.id)
    message.channel.send(output, {code: "asciidoc", split: { char: "\u200b" }});
  } else {
    // Show individual command's help.
    let command = args[1];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (perms < command.conf.permLevel) return;
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage:: ${config.prefix}${command.help.usage}`, {code:"asciidoc"});
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp"],
  permLevel: 0
};

exports.help = {
  name: "help",
  category: "System",
  description: "Displays all the available commands for your permission level.",
  usage: "help [command]"
};
