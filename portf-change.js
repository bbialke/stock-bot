const sqlite3 = require('sqlite3').verbose();
var holdingsDB = require('./manageHoldingsDB');
const moment = require('moment');
module.exports = {
  init: function init(userID){
    var db;
    var response;
    console.log('Creating Database Chain to store the userID stocks');
    db = new sqlite3.Database('./userStocks.sqlite', createTable);

    function createTable() { // Extends createDb
      db.run("CREATE TABLE IF NOT EXISTS portfolioChange (UserID TEXT, savedAmount INTEGER, dateSaved TEXT)", checkIfCreated);
    }
    function checkIfCreated() {
      console.log('Creating Table');
      db.get(`SELECT * FROM portfolioChange WHERE UserID = ${userID}`, function(err, row) {
        if (!row) {
          console.log('user is not in database - adding');
          insertRows();
        }
        else {
          console.log('user is in database - returning');
          //db.run(`UPDATE holdings SET HoldingID = '${row + 2}' WHERE userID = '${userID}'`)
          returnDb();
        }
      })
    }

    function insertRows() { // Extends createTable
      var stmt = db.prepare("INSERT INTO portfolioChange (UserID, savedAmount, dateSaved) VALUES (?,?,?)");
      stmt.run(userID, 0, '01/01/2000')
      stmt.finalize(readAllRows);
    }
    function readAllRows() { // Extends insertRows
      db.get(`SELECT * FROM portfolioChange WHERE UserID = ${userID}`, function(err, row) {
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
  resolvePrevValue: function init(userID){
    var db;
    var response;
    console.log('Creating Database Chain to store the userID stocks');
    db = new sqlite3.Database('./userStocks.sqlite', createTable);

    function createTable() { // Extends createDb
      db.run("CREATE TABLE IF NOT EXISTS portfolioChange (UserID TEXT, savedAmount INTEGER, dateSaved TEXT)", checkIfCreated);
    }
    function checkIfCreated() {
      console.log('Creating Table');
      db.get(`SELECT * FROM portfolioChange WHERE UserID = ${userID}`, function(err, row) {
        if (!row) {
          console.log('inserting rows');
          insertRows();
        }
        else {
          getPreviousInfo();
        }
      })
    }

    async function getPreviousInfo(){
      db.get(`SELECT * FROM portfolioChange WHERE UserID = ${userID}`, function(err, row) {
        console.log(row);
        //get the elements we need from the db
        let prevPortfolioValue = row.savedAmount;
        let prevSavedDate = row.dateSaved;
        console.log(prevPortfolioValue);
        console.log(prevSavedDate);
        //setup exports to read prev data
        module.exports.prevPortValue = prevPortfolioValue;
        module.exports.prevSaveDate = prevSavedDate;
        //update data
        //extremely jank solution - wait for other script to finish then grab that value
        //that idea is terrible
        //so that's the one I used
        //if the script breaks now I know where to look lmao
        setTimeout(function(){
          let portfolioValue = parseFloat(holdingsDB.portfolio_final);
          //to nearest 2 decimal places
          portfolioValue = portfolioValue.toFixed(2);
          //gotta make sure it's a float
          portfolioValue = parseFloat(portfolioValue);
          //get current time
          let currentTime = moment().format('MM-DD-YYYY HH:mm')
          currentTime = currentTime.toString();
          //do the prepared statement thingy
          //can you tell that its 2 am by my comments?
          db.run(`UPDATE portfolioChange SET savedAmount = '${portfolioValue}' WHERE UserID = '${userID}'`);
          db.run(`UPDATE portfolioChange SET dateSaved = '${currentTime}' WHERE UserID = '${userID}'`);
        }, 1550);
      })
    }

    function insertRows() { // Extends createTable
      var stmt = db.prepare("INSERT INTO portfolioChange (UserID, savedAmount, dateSaved) VALUES (?,?,?)");
      stmt.run(userID, 0, '01/01/2000')
      stmt.finalize(readAllRows);
    }
    function readAllRows() { // Extends insertRows
      db.get(`SELECT * FROM portfolioChange WHERE UserID = ${userID}`, function(err, row) {
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
