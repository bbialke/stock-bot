var money = require('discord-money');

exports.run = async (client, message, args, level) =>{

  money.fetchBal(message.author.id).then((i) => { // money.fetchBal grabs the userID, finds it, and puts it into 'i'.
    if(i.money <= 200){
      money.updateBal(message.author.id, 500 /* Value */).then((i) => { // money.updateBal grabs the (userID, value) value being how much you want to add, and puts it into 'i'.
        message.channel.send(`**You got $500!**\n**New Balance:** $${i.money}`);
      })
    } else{
      message.channel.send(`You've already got money, you don't need a loan`);
    }
  })
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'loan',
  category: "Misc",
  description: 'Gives you money if you are running low',
  usage: 'daily'
};
