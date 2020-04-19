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
          //db.run(`UPDATE holdings SET HoldingID = '${row + 2}' WHERE userID = '${userID}'`)
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
  buy: function init(userID, symbol, count){
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
          manageStockDatabase();
        }
      })
    }

    async function manageStockDatabase(){
      console.log(symbol)
      let response = await db.each(`SELECT * FROM stocks WHERE Symbol = '${symbol}'`,(error, row) => {
        if(!row){
          buyStock();
          return;
        } else{
          console.log(`${row.HoldingID} (symbol: ${row.Symbol}) found`);
          db.each(`SELECT * FROM holdings WHERE HoldingID = ${row.HoldingID} AND UserID = ${userID}`, (error, row1) => {
            console.log(row1)
            if(!row1){
              buyStock();
              return;
            } else{
              console.log(`Found row ${row.HoldingID} that matches what the user is buying. Updating this row`);
              db.run(`UPDATE holdings SET Count = '${row1.Count + count}' WHERE HoldingID = '${row.HoldingID}'`);
              db.get(`SELECT * FROM stocks WHERE HoldingID = (SELECT MAX(HoldingID) FROM stocks)`, (err, rowOM) => {
                console.log(`Value to delete is holdingID ${rowOM.HoldingID}`)
                //delete the stuff the other function made
                db.run(`DELETE FROM holdings WHERE HoldingID = ${rowOM.HoldingID}`);
                db.run(`DELETE FROM stocks WHERE HoldingID = ${rowOM.HoldingID}`);
                return;
              })
            }
          });
        }
      });
      buyStock();
    }

    async function buyStock(){

      db.get(`SELECT * FROM stocks WHERE HoldingID = (SELECT MAX(HoldingID) FROM stocks)`, function(err, rowA) {
        console.log('updating shares');
        console.log(rowA);
        rowValue = parseInt(rowA.HoldingID);
        console.log(rowValue);
        var stmt = db.prepare("INSERT INTO stocks (HoldingID,Symbol) VALUES (?,?)");
        stmt.run(rowValue + 1, symbol);
        stmt.finalize();
      })
      db.get(`SELECT * FROM holdings WHERE HoldingID = (SELECT MAX(HoldingID) FROM holdings)`, function(err, rowZ) {
        console.log('updating shares');
        console.log(rowZ);
        rowValue = parseInt(rowZ.HoldingID);
        console.log(rowValue);
        var stmt = db.prepare("INSERT INTO holdings (HoldingID,UserID,Count) VALUES (?,?,?)");
        stmt.run(rowValue + 1, userID, count);
        stmt.finalize();
        returnDb();
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
  sell: function init(userID, symbol, count){
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
          queryDB();
        }
      })
    }

    async function queryDB(){
      await db.all(`SELECT * FROM holdings WHERE UserID = ${userID} ORDER BY HoldingID`,(error, holdingRows) => {
        holdingRows.forEach( holdingRow => {
          //log the holdingID and owner to console
          console.log(`Holding ID #${ holdingRow.HoldingID} is registered to ${userID}`)
          //find a list of all stocks that match the HoldingID from above and the symbol we are searching for
          let response2 = db.all(`SELECT * FROM stocks WHERE HoldingID = ${holdingRow.HoldingID}`,(error, symbolRows) => {
            symbolRows.forEach( symbolRow => {
              //log all symbols that match a holdingID to console
              console.log(`Holding ID #${symbolRow.HoldingID} has a symbol of ${symbolRow.Symbol}`)
              if(symbolRow.Symbol == symbol){
                //we found the symbol requested, now we check the count
                console.log(`HoldingID ${symbolRow.HoldingID} matches the search, and has a symbol of ${symbolRow.Symbol}`)
                if(holdingRow.Count < count){
                  module.exports.success = false;
                  return console.log(`not enough shares owned as was requested to sell.`)
                } else{
                  console.log(`Total Shares: ${holdingRow.Count}`)
                  console.log(`Requested to sell: ${count}`)
                  console.log(`All clear to delete holding row #${symbolRow.HoldingID}`)
                  db.run(`DELETE FROM stocks WHERE HoldingID = ${symbolRow.HoldingID}`);
                  db.run(`DELETE FROM holdings WHERE HoldingID = ${symbolRow.HoldingID}`);
                  module.exports.success = true;
                  return console.log(`deletion of HoldingID #${holdingRow.HoldingID} successful`)
                }
              }
            });
          })
        });
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
