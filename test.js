console.log("Program started")
const myFunctions = require('./functions');
const index = require('./index');

var request = require('request');
var https = require('https')

event = {};
event.request = {}
event.request.intent = {};
event.request.intent.slots = {};
event.request.intent.slots.StockString = {};
event.request.intent.slots.portfolioName = {};
event.request.type = "IntentRequest";
event.session = {};
//event.session.new = true;

context = {};
context.succeed = function (input) {
}
context.fail = function (input) {
        console.log("Youve got an error")
}

requests = ["GetMyPortfolios", "GetStockInfo", "GetTechnicalInfo", "GetPortfolioMetrics"];
StockStrings = ["null", "anglo", "vodafone", "null"];
portfolioNames = ["null", "null", "null", "top 50 us stock"];
for (var i = 0; i < requests.length; i++) {
        event.request.intent.name = requests[i];
        event.request.intent.slots.StockString.value = StockStrings[i]
        event.request.intent.slots.portfolioName.value = portfolioNames[i]
        index.handler(event, context);
}

