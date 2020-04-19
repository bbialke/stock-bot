const sqlite3 = require('sqlite3').verbose();
var resolve = require('resolve');
var holdingsDB = require('../manageHoldingsDB');
var stocksDB = require('../manageStocksDB');
const portfolioChange = require('../portf-change.js');
const stockdata = require('stock-data.js');
var money = require('discord-money');
const Discord = require('discord.js');
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
//1 - Total investment amount
//2 - list stocks with shares and total amount next to them
//rich embed if possible
var user = message.author.id;
let cash;
holdingsDB.init(user);
stocksDB.init(user);
portfolioChange.init(user);


money.fetchBal(message.author.id).then((i) =>{
  //ensure this is a float
  cash = parseFloat(i.money);
  cash = cash.toFixed(2);
  cash = parseFloat(cash);
})

//lookup the user's stocks
holdingsDB.lookup(user);
//get the previous value of the users portfolio
portfolioChange.resolvePrevValue(user);
//send a pre-message then wait 1.6 seconds for data to return
message.channel.send(`Getting your portfolio value...`).catch(console.error).then((msg)=>{
  setTimeout(function(){
    //get portfolio value
    let portfolioValue = parseFloat(holdingsDB.portfolio_final);
    //to nearest 2 decimal places
    portfolioValue = portfolioValue.toFixed(2);
    //gotta make sure it's a float
    portfolioValue = parseFloat(portfolioValue);
    //get array of owned stock symbols
    let symbolArray = holdingsDB.symbolArray;
    //get array of owned stock amounts
    let countArray = holdingsDB.countArray;
    //remove the dummy 'AAPL' symbol from the array

    for(var i = symbolArray.length - 1; i >= 0; i--) {
      if(symbolArray[i] === 'AAPL') {
        symbolArray.splice(i, 1);
      }
    }
    //remove the dummy '0' from the array
    for(var i = countArray.length - 1; i >= 0; i--) {
      if(countArray[i] === 0) {
        countArray.splice(i, 1);
      }
    }
    //add count of shares in between share symbol
    let newarray = symbolArray.map((el, i) => {
      if(countArray[i] == 1){
        return el + " (" + countArray[i] + " share)"
      } else{
        return el + " (" + countArray[i] + " shares)"
      }
    })
    //log this new array of symbols and counts
    console.log(newarray);
    //do data calcualtions here instead of in the RichEmbed
    var totalP = cash + portfolioValue
    totalP = totalP.toFixed(2);
    //message.channel.send(`Your portfolio value is $${portfolioValue}`).catch(console.error);
    //get previous data values to show change over time
    let prevPortfolioValue = parseFloat(portfolioChange.prevPortValue);
    let prevSavedDate = portfolioChange.prevSaveDate;
    console.log(prevPortfolioValue);
    console.log(prevSavedDate);
    //get total change
    let totalChange = portfolioValue-prevPortfolioValue;
    console.log(totalChange)
    let degreeOfChange = 'null'
    if(Math.sign(totalChange) == 1){
      degreeOfChange = '**up**'
    } else if (Math.sign(totalChange) == -1){
      degreeOfChange = '**down**'
    } else{
      degreeOfChange = 'even'
    }
    totalChange = totalChange.toFixed(2);

    //rich embed the data
    const portfolioEmbed = new Discord.RichEmbed()
  	.setColor('#0099ff')
  	.setTitle('Your Portfolio')
  	.setURL('https://discord.js.org/')
  	.setAuthor('StockBot')
  	.setDescription('Note: this bot only tracks and monitors stocks and should not serve as the basis of any financial decision')
    .setThumbnail('https://cdn4.iconfinder.com/data/icons/stock-trading-apps/500/Stocks-2_14-512.png')
  	.addField('Portfolio Value (Investments):', `**$${portfolioValue}**`)
    .addField('Portfolio Value (Cash):', `**$${cash.toFixed(2)}**`)
    .addField('Total Portfolio:', `**$${totalP}**`)
  	.addBlankField()
    .addField('Owned Stocks', `${newarray.join(', ')}`)
    .addBlankField()
    .addField('Portfolio Change', `Stocks are ${degreeOfChange} $${totalChange} since ${prevSavedDate}`)
    .addBlankField()
  	.addField('More Information', 'Use $quote <symbol> for more info on a particular stock', true)
  	//.addField('Inline field title', 'Some value here', true)
  	//.addField('Inline field title', 'Some value here', true)
  	.setTimestamp()
  	.setFooter('StockBot, 2019');

    msg.edit(portfolioEmbed);



  }, 1600);
})
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'myStocks',
  category: "Misc",
  description: 'Lists the stocks you own',
  usage: 'myStocks'
};
