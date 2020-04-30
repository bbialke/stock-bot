const stockdata = require('stock-data.js');
const config = require("../config.json");
exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
  if(args.length == 0){
  message.channel.send("Please mention a stock symbol to quote").catch(console.error);
} else{
  let symbol = null;
  console.log(args[1]);
  argsSTR = args[1].toString();
  symbol = argsSTR.toUpperCase();
  console.log(symbol);
  message.channel.send("retrieving stock quote for " + symbol + "...").catch(console.error).then((msg)=>{
  stockdata.realtime({
    symbols: symbol,
    API_TOKEN: config.APIKey,
  })
  .then(response => {
    console.log(response);
    if(response.data[0] == undefined){
      msg.edit(`Please enter a valid stock symbol. Note: Stock symbols aren't the same as company names. For example, APPLE's symbol is AAPL. *(err.symbol.undefined)*`).catch(console.error);
    } else{
    msg.edit(symbol + " (" + response.data[0].name + ") is currently trading at $" + response.data[0].price + " per share. Use $info <symbol> for further information.").catch(console.error);
  }
  })
  .catch(error => {
    console.log(error);
  });
    })
  }
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'quote',
  category: "Misc",
  description: 'Fetches a quote of a stock',
  usage: 'quote [stock]'
};
