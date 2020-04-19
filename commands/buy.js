const sqlite3 = require('sqlite3').verbose();
var resolve = require('resolve');
var holdingsDB = require('../manageHoldingsDB');
var stocksDB = require('../manageStocksDB');
const stockdata = require('stock-data.js');
var money = require('discord-money');
const config = require("../config.json");
exports.run = async (client, message, args, level) =>{
var user = message.author.id;

console.log(args);

holdingsDB.init(user);
stocksDB.init(user);

var count = parseInt(args[2]);
console.log(count);
if (isNaN(count)) {
	message.channel.send("Please enter a valid number of shares").catch(console.error);
} else{

	var symbol_raw = args[1];
  symbol_lower = symbol_raw.toString();
  symbol = symbol_lower.toUpperCase();
  console.log(symbol);

	stockdata.realtime({
		symbols: symbol,
		API_TOKEN: config.APIKey
	})
	.then(response => {
		console.log(response);
		//only allow updates every 10 min
		var totalMoneyRaw = count * response.data[0].price;
		var totalMoney = totalMoneyRaw.toFixed(2);
		money.fetchBal(message.author.id).then((i) =>{ // money.fetchBal grabs the userID, finds it, and puts it into 'i'.
	   if(i.money < totalMoney){
			 return message.reply(`Sorry, you don't have enough money for this purchase (err.low.balance)`);
		 } else{
			 message.channel.send("You are about to purchase " + count + " shares of " + symbol + " (" + response.data[0].name + ") for $" + response.data[0].price + " per share ($" + totalMoney + ")").catch(console.error);
	 		message.channel.send("Please type CONFIRM to confirm this transaction or wait 10 seconds to abort").catch(console.error);

	 		message.channel.awaitMessages(response => response.content.toLowerCase() === 'confirm', {
	     max: 1,
	     time: 10000,
	     errors: ['time'],
	   })
	   .then((collected) => {
	 			message.channel.send('Transaction Processing...').then((msg)=>{
	 				//holdingsDB.buy(user, count);
	 				stocksDB.buy(user, symbol, count);
					money.updateBal(message.author.id, -totalMoney)
	 				msg.edit('✓ Transaction Completed');
	 			})

	     })
	     .catch(() => {
	       message.channel.send('No response was submitted within 10 seconds. Transaction aborted.');
	     });
		 }
	  })

	})
	.catch(error => {
		console.log(error);
	});
}




};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'buy',
  category: "Misc",
  description: 'Allows you to buy stocks',
  usage: 'buy [stock] <amount>'
};
