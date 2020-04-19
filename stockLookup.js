const stockdata = require('stock-data.js');
const config = require("./config.json");
module.exports = {

lookup: function init(symbol){

  stockdata.realtime({
    symbols: symbol,
    API_TOKEN: config.APIKey
  })
  .then(response => {
    //console.log(response);
    console.log(`price quote recieved`);
    var stockPrice = response.data[0].price
    //console.log(`${symbol} at ${stockPrice}`);
    //console.log(portfolioValue);
    //portfolioValue = portfolioValue + stockPrice * count;
    //console.log(portfolioValue);
    return stockPrice;
  })

}
};
