const sqlite3 = require('sqlite3').verbose();
module.exports = {
  init: function init(userID){
    var db;
    var response;
    console.log('Creating Database Chain to store the userID stocks');
    db = new sqlite3.Database('./userStocks.sqlite', createTable);

    function createTable() { // Extends createDb
      db.run("CREATE TABLE IF NOT EXISTS stocks (HoldingID INTEGER, Symbol TEXT, FOREIGN KEY(HoldingID) REFERENCES holdings(HoldingID))", checkIfCreated);
    }
    function checkIfCreated() {
      console.log('Creating Table');
      db.get(`SELECT * FROM stocks WHERE HoldingID = '1'`, function(err, row) {
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
      var stmt = db.prepare("INSERT INTO stocks (HoldingID,Symbol) VALUES (?,?)");
      stmt.run(1, 'AAPL')
      stmt.finalize(readAllRows);
    }
    function readAllRows() { // Extends insertRows
      db.get(`SELECT * FROM stocks WHERE HoldingID = '1'`, function(err, row) {
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
  buy: function init(userID, symbol){
    var db;
    var response;
    console.log('Creating Database Chain to store the userID stocks');
    db = new sqlite3.Database('./userStocks.sqlite', createTable);

    function createTable() { // Extends createDb
      db.run("CREATE TABLE IF NOT EXISTS stocks (HoldingID INTEGER, Symbol TEXT, FOREIGN KEY(HoldingID) REFERENCES holdings(HoldingID))", checkIfCreated);
    }
    function checkIfCreated() {
      console.log('Creating Table');
      db.get(`SELECT * FROM stocks WHERE HoldingID = '1'`, function(err, row) {
        if (!row) {
          console.log('inserting rows');
          insertRows();
        }
        else {
          db.get(`SELECT * FROM stocks WHERE HoldingID = (SELECT MAX(HoldingID) FROM stocks)`, function(err, row) {
            console.log('updating shares');
            console.log(row);
            rowValue = parseInt(row.HoldingID);
            console.log(rowValue);
            var stmt = db.prepare("INSERT INTO stocks (HoldingID,Symbol) VALUES (?,?)");
            stmt.run(rowValue + 1, symbol);
            stmt.finalize();
            returnDb();
          })
        }
      })
    }

    function insertRows() { // Extends createTable
      var stmt = db.prepare("INSERT INTO stocks (HoldingID,Symbol) VALUES (?,?)");
      stmt.run(1, 'AAPL')
      stmt.finalize(readAllRows);
    }
    function readAllRows() { // Extends insertRows
      db.get(`SELECT * FROM stocks WHERE HoldingID = '1'`, function(err, row) {
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
  sell: function init(userID, symbol){
    var db;
    var response;
    console.log('Creating Database Chain to store the userID stocks');
    db = new sqlite3.Database('./userStocks.sqlite', createTable);

    function createTable() { // Extends createDb
      db.run("CREATE TABLE IF NOT EXISTS stocks (HoldingID INTEGER, Symbol TEXT, FOREIGN KEY(HoldingID) REFERENCES holdings(HoldingID))", checkIfCreated);
    }
    function checkIfCreated() {
      console.log('Creating Table');
      db.get(`SELECT * FROM stocks WHERE HoldingID = '1'`, function(err, row) {
        if (!row) {
          console.log('inserting rows');
          insertRows();
        }
        else {
          db.get(`SELECT * FROM stocks WHERE HoldingID = (SELECT MAX(HoldingID) FROM stocks)`, function(err, row) {
            console.log('updating shares');
            console.log(row);
            rowValue = parseInt(row.HoldingID);
            console.log(rowValue);
            var stmt = db.prepare("INSERT INTO stocks (HoldingID,Symbol) VALUES (?,?)");
            stmt.run(rowValue + 1, symbol);
            stmt.finalize();
            returnDb();
          })
        }
      })
    }

    function insertRows() { // Extends createTable
      var stmt = db.prepare("INSERT INTO stocks (HoldingID,Symbol) VALUES (?,?)");
      stmt.run(1, 'AAPL')
      stmt.finalize(readAllRows);
    }
    function readAllRows() { // Extends insertRows
      db.get(`SELECT * FROM stocks WHERE HoldingID = '1'`, function(err, row) {
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
