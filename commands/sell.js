const sqlite3 = require('sqlite3').verbose();
var resolve = require('resolve');
var holdingsDB = require('../manageHoldingsDB');
var stocksDB = require('../manageStocksDB');
const stockdata = require('stock-data.js');
var money = require('discord-money');
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

	const config = require("../config.json");

	stockdata.realtime({
		symbols: symbol,
		API_TOKEN: config.APIKey
	})
	.then(response => {
		console.log(response);
		//only allow updates every 10 min
		var totalMoneyRaw = count * response.data[0].price;
		var totalMoney = totalMoneyRaw.toFixed(2);
		message.channel.send("You are about to sell " + count + " shares of " + symbol + " (" + response.data[0].name + ") for $" + response.data[0].price + " per share ($" + totalMoney + ")").catch(console.error);
	 	message.channel.send("Please type CONFIRM to confirm this transaction or wait 10 seconds to abort").catch(console.error);

	 		message.channel.awaitMessages(response => response.content.toLowerCase() === 'confirm', {
	     max: 1,
	     time: 10000,
	     errors: ['time'],
	   })
	   .then((collected) => {
	 			message.channel.send('Transaction Processing...').then((msg)=>{
	 				//holdingsDB.sell(user, count);
	 				stocksDB.sell(user, symbol, count);
					//wait 2 seconds, check if error, then edit message with success or error msg
					setTimeout(function(){
						let successStatus = stocksDB.success;
						if(successStatus == true){
							money.updateBal(message.author.id, +totalMoney)
							msg.edit('✓ Transaction Completed');
						} else{
							msg.edit(`✗ Transaction Failed: You don't own that many shares of ${symbol} (err.low.count)`);
						}

					}, 1500);
	 			})

	     })
	     .catch(() => {
	       message.channel.send('No response was submitted within 10 seconds. Transaction aborted.');
	     });

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
  name: 'sell',
  category: "Misc",
  description: 'Allows you to sell stocks',
  usage: 'sell [stock] <amount>'
};
