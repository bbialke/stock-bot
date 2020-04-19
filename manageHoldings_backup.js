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
                db.each(`SELECT HoldingID HoldingID FROM holdings WHERE userID = ${userID}`, function(err, row) {
                  console.log(`Errors: ${err}`);
                  console.log(`Row.HoldingID: ${row.HoldingID}`);
                  holdingRowValue = parseInt(row.HoldingID);
                  db.each(`SELECT Symbol Symbol FROM stocks WHERE HoldingID = ${holdingRowValue}`, function(err, stocksRow) {
                    console.log(stocksRow);
                    console.log(`Errors: ${err}`);
                    console.log(`Row.Symbol: ${stocksRow.Symbol}`);
                    stocksRowValue = toString(stocksRow.Symbol);
                    console.log(stocksRow.Symbol);
                    db.each(`SELECT Count Count FROM holdings WHERE HoldingID = ${row.HoldingID}`, function(err, countRow) {
                    console.log(countRow);
                    console.log(`Errors: ${err}`);
                    console.log(`Row.HoldingID: ${row.HoldingID}`);
                    trueCount = parseInt(countRow.Count);
                    console.log(`You own ${trueCount} shares of ${stocksRow.Symbol}`);
                      console.log(`pushing to array`);
                      var lookedUpPrice = stockLookup.lookup(stocksRow.Symbol);
                      priceArray.push(lookedUpPrice);
                      console.log(priceArray);
                  })
                })
                //var stmt = db.prepare("INSERT INTO holdings (HoldingID,UserID,Count) VALUES (?,?,?)");
                //  stmt.run(rowValue + 1, userID, count);
                //  stmt.finalize();
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

        }
};
