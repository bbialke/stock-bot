var money = require('discord-money');

exports.run = async (client, message, args, level) =>{

  money.fetchBal(message.author.id).then((i) =>{ // money.fetchBal grabs the userID, finds it, and puts it into 'i'.
    message.channel.send(`**Balance:** $${i.money}`);
  })
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'money',
  category: "Misc",
  description: 'Retrieves the amount of money you have',
  usage: 'money'
};
