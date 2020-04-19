const sqlite3 = require('sqlite3').verbose();
const stockdata = require('stock-data.js');
var stockLookup = require('./stockLookup');
module.exports = {
  init: function init(userID){
    var db;
    var response;
    console.log('Creating Database Chain to store the userID stocks');
    db = new sqlite3.Database('./userStocks.sqlite', createTable);

    function createTable() { // Extends createDb
      db.run("CREATE TABLE IF NOT EXISTS holdings (HoldingID INTEGER, userID TEXT, Count INTEGER)", checkIfCreated);
      //db.run("CREATE TABLE IF NOT EXISTS stocks (HoldingID INTEGER, Symbol TEXT, FOREIGN KEY(HoldingID) REFERENCES holdings(HoldingID))", checkIfCreated);
    }
    function checkIfCreated() {
      console.log('Creating Table');
      db.get(`SELECT * FROM holdings WHERE HoldingID = '1'`, function(err, row) {
        if (!row) {
          console.log('inserting rows');
          insertRows();
        }
        else {
          console.log('updating shares');
          //db.run(`UPDATE holdings SET HoldingID = '${row + 2}' WHERE userID = '${message.author.id}'`)
          returnDb();
        }
      })
    }

    function insertRows() { // Extends createTable
      var stmt = db.prepare("INSERT INTO holdings (HoldingID,UserID,Count) VALUES (?,?,?)");
      stmt.run(1, userID, 0)
      stmt.finalize(readAllRows);
    }
    function readAllRows() { // Extends insertRows
      db.get(`SELECT * FROM holdings WHERE userID = '${userID}'`, function(err, row) {
        closeDb()
      })

    }
    function closeDb() { // Extends readAllRows
      checkIfCreated()
      db.close();
    }
    function returnDb() {
    }

  },
  buy: function init(userID, count){
    var db;
    var response;
    console.log('Creating Database Chain to store the userID stocks');
    db = new sqlite3.Database('./userStocks.sqlite', createTable);

    function createTable() { // Extends createDb
      db.run("CREATE TABLE IF NOT EXISTS holdings (HoldingID INTEGER, userID TEXT, Count INTEGER)", checkIfCreated);
      //db.run("CREATE TABLE IF NOT EXISTS stocks (HoldingID INTEGER, Symbol TEXT, FOREIGN KEY(HoldingID) REFERENCES holdings(HoldingID))", checkIfCreated);
    }
    function checkIfCreated() {
      console.log('Creating Table');
      db.get(`SELECT * FROM holdings WHERE HoldingID = '1'`, function(err, row) {
        if (!row) {
          console.log('inserting rows');
          insertRows();
        }
        else {
          db.get(`SELECT * FROM holdings WHERE HoldingID = (SELECT MAX(HoldingID) FROM holdings)`, function(err, row) {
            console.log('updating shares');
            console.log(row);
            rowValue = parseInt(row.HoldingID);
            console.log(rowValue);
            var stmt = db.prepare("INSERT INTO holdings (HoldingID,UserID,Count) VALUES (?,?,?)");
            stmt.run(rowValue + 1, userID, count);
            stmt.finalize();
            returnDb();
          })
        }
      })
    }

    function insertRows() { // Extends createTable
      var stmt = db.prepare("INSERT INTO holdings (HoldingID,UserID,Count) VALUES (?,?,?)");
      stmt.run(1, userID, 0)
      stmt.finalize(readAllRows);
    }
    function readAllRows() { // Extends insertRows
      db.get(`SELECT * FROM holdings WHERE userID = '${userID}'`, function(err, row) {
        closeDb()
      })

    }
    function closeDb() { // Extends readAllRows
      checkIfCreated()
      db.close();
    }
    function returnDb() {
    }

  },
  lookup: function init(userID){
    var db;
    let iteration = 0;
    let priceArray = [];
    let symbolArray = [];
    let countArray = [];
    let portfolioValue = 0;
    var response;
    console.log('Creating Database Chain to store the userID stocks');
    db = new sqlite3.Database('./userStocks.sqlite', createTable);

    function createTable() { // Extends createDb
      db.run("CREATE TABLE IF NOT EXISTS holdings (HoldingID INTEGER, userID TEXT, Count INTEGER)", checkIfCreated);
      //db.run("CREATE TABLE IF NOT EXISTS stocks (HoldingID INTEGER, Symbol TEXT, FOREIGN KEY(HoldingID) REFERENCES holdings(HoldingID))", checkIfCreated);
    }
    function checkIfCreated() {
      console.log('Creating Table');
      db.get(`SELECT * FROM holdings WHERE HoldingID = '1'`, function(err, row) {
        if (!row) {
          console.log('inserting rows');
          insertRows();
        }
        else {
          queryDB();
        }
      })
    }


    async function queryDB(){
      let allData = await selectAllData();
    }
    //selects all data
    async function selectAllData(){
      await db.all(`SELECT * FROM holdings WHERE UserID = ${userID} ORDER BY HoldingID`,(error, holdingRows) => {
        holdingRows.forEach( holdingRow => {
          //log the holdingID and count to console
          console.log(`Holding ID #${ holdingRow.HoldingID} has value "count" set to ${holdingRow.Count}`)
          //find a list of all stocks that match the HoldingID from above
          let response2 = db.all(`SELECT * FROM stocks WHERE HoldingID = ${holdingRow.HoldingID} ORDER BY HoldingID`,(error, symbolRows) => {
            symbolRows.forEach( symbolRow => {
              //log all symbols that match a holdingID to console
              console.log(`Holding ID #${symbolRow.HoldingID} has a symbol of ${symbolRow.Symbol}`)
              queryPrice();

              //lookup stock price based on given symbols, awaiting the result
              async function queryPrice(){
                var response = await queryStockPrice(symbolRow.Symbol);
                //log the retrieved price
                console.log(`Retrieved a price of ${response} for stock ${symbolRow.Symbol}`)
                //add symbols to array for later
                symbolArray.push(symbolRow.Symbol);
                //add count to array for later
                countArray.push(holdingRow.Count);
                //calculate what the change in the portfolio will be
                var portfolioUpdate = await calculatePortfolio(response, holdingRow.Count);
                //update portfolio value and log new amount
                portfolioValue = portfolioValue + portfolioUpdate;
                console.log(portfolioValue);
              }
            });
          })
        });
      })
      console.log(`returning`);
      return;
    }
    //function to query stock price
    async function queryStockPrice(stockSym){
      let stockPrice;
      let response = await stockdata.realtime({
        symbols: stockSym,
        API_TOKEN: "Anxn5HWYJbEkhoDRga26obWSdgCWza1ykI23BKdsCJPneOkrz18vC9S95Iqp"
      }).then(response => {
        //get only the data for the price
        var stockPrice_raw = response.data[0].price
        //retrived stock price from API, so we log the price we recieved along with the symbol (log is above, no need for this devLog)
        //console.log(`Retrieved price of ${stockSym}, at ${stockPrice_raw}`)
        //return the gathered price
        stockPrice = stockPrice_raw;
      })
      return stockPrice;
    }
    //initial portfolio calcualtions
    async function calculatePortfolio(price, count){
      //define amount, then do maths
      let amount;
      amount = price * count;
      //return portfolio update amount
      return amount;
    }


    //idk how to set it up to return the final value when the database queries are complete, so a 1.5 second delay is probobly good enough
    setTimeout(function(){
      //make final changes to portfolio value and log them
      var portfolio_final = portfolioValue.toFixed(2);
      console.log(`All portfolio calcualtions completed. Total portfolio value is $${portfolio_final}. Ready to return to main script`)
      module.exports.portfolio_final = portfolio_final;
      module.exports.symbolArray = symbolArray;
      module.exports.countArray = countArray;
    }, 1500);




    //misc functions that might not be needed but break the program when removed
    function insertRows() { // Extends createTable
      var stmt = db.prepare("INSERT INTO holdings (HoldingID,UserID,Count) VALUES (?,?,?)");
      stmt.run(1, userID, 0)
      stmt.finalize(readAllRows);
    }
    function readAllRows() { // Extends insertRows
      db.get(`SELECT * FROM holdings WHERE userID = '${userID}'`, function(err, row) {
        closeDb()
      })

    }
    function closeDb() { // Extends readAllRows
      checkIfCreated()
      db.close();
    }
    function returnDb() {
    }
  }
};
