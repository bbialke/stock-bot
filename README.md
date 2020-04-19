# Stock-Bot

StockBot is a Discord bot that tracks real time stock data and allows users to build their own portfolio of stocks without having to worry about the actual risks of the stock market. Users have their portfolios held in an sqlite database, and the value of stocks is updated in real time thanks to [WorldTradingData](https://www.worldtradingdata.com/).

## Installation

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org) (which comes with [npm](https://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/bbialke/stock-bot.git
# Go into the repository
cd stock-bot
# Install dependencies
npm install
# Run the app
node .
```
Note that you'll also need to create your own `config.json` file in the main directory. Update it with the following information:
```json
{"prefix":"[Your desired prefix]","token":"[Discord bot token]", "APIKey":"[WorldTradingData Key]"}
```
You can grab your token from [discord's developer portal](https://discordapp.com/developers/applications).
But wait, there's more! You'll also need your own API Key from [WorldTradingData](https://www.worldtradingdata.com/), which you can paste into the APIKey section of the config.
## Usage

**Commands List:**
- Buy - Allows you to buy a stock (or multiple)
- Sell - Allows you to sell a stock (or multiple)
- Quote - Get a real time quote for any stock
- Loan - Gives you a loan if you're running low on cash
- Money - Check how much money you've got left
- myStocks - View all the stocks you own, and their current value
- Help - View the help for commands

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
