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
                db.all(`SELECT * FROM holdings WHERE UserID = ${userID} ORDER BY holdingID`,(error, rows) => {
                rows.forEach( row => {
                  console.log(`${ row.HoldingID} has a count of ${row.Count}`)
                  countArray.push(row.Count);
                  //idArray.push(row.HoldingID);
                  console.log(`CountArray ${countArray}`);
                  db.all(`SELECT * FROM stocks WHERE HoldingID = ${row.HoldingID} ORDER BY holdingID`,(error, rows1) => {
                  rows1.forEach( row1 => { console.log(`${ row1.HoldingID} has a symbol of ${row1.Symbol}`)
                  symbolArray.push(row1.symbol);
                  console.log(`SymbolArray ${symbolArray}`);
                  stockPriceHandler();
                  async function stockPriceHandler(){
                    console.log(row1.Symbol);
                    let response = await stockdata.realtime({
                      symbols: row1.Symbol,
                      API_TOKEN: "Anxn5HWYJbEkhoDRga26obWSdgCWza1ykI23BKdsCJPneOkrz18vC9S95Iqp"
                    })
                    .then(response => {
                      //console.log(response);
                      console.log(`price quote recieved`);
                      var stockPrice = response.data[0].price
                      //console.log(`${symbol} at ${stockPrice}`);
                      //console.log(portfolioValue);
                      //portfolioValue = portfolioValue + stockPrice * count;
                      //console.log(portfolioValue);
                      console.log(`lookup completed`);
                      priceArray.push(stockPrice);
                      console.log(`PriceArray ${priceArray}`);
                        console.log(portfolioValue)
                        portfolioValue = portfolioValue + stockPrice * row.Count;
                        console.log(portfolioValue);
                    })
                  }
                });
                });
              });
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
        function exitAndReturn() { // Extends readAllRows
          console.log(`closing DB`);
          db.close();
          console.log(`returning portfolio value of ${portfolioValue}`)
          return portfolioValue;
        }
        function returnDb() {
        }
        setTimeout(function(){
          console.log(`returning value`);
          module.exports.portfolioValue = portfolioValue;
        }, 1000);
    }
};
