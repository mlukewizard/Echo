var request = require('request');
var https = require('https')
const myFunctions = require('./functions');

const Alexa = require('alexa-sdk'); //newline

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);

  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {

  'LaunchRequest': function(){
    this.emit('LaunchIntent');
  },

  'LaunchIntent': function(){
    this.emit(':ask', "Welcome to OTAS, how can I help?");
  },

  'GetStockInfo': function(){
        var objGetStockInfo = this;
        var OtasID = myFunctions.GetOtasID(objGetStockInfo.event.request.intent.slots.StockString.value);
        var Print = myFunctions.StockInfo(OtasID, function(sPrintString){
          objGetStockInfo.emit(':tell', sPrintString);
          console.log(sPrintString + "\n");
        })
  },

  'GetMyPortfolios': function(){
      var objGetStockInfo = this;
      myFunctions.GetMyPortfolios(function(sPrintString){
        objGetStockInfo.emit(':tell', sPrintString);
        console.log(sPrintString + "\n");
      })
  },

  'GetTechnicalInfo': function(){
      var objGetTechnicalInfo = this;
      var OtasID = myFunctions.GetOtasID(objGetTechnicalInfo.event.request.intent.slots.StockString.value);
        myFunctions.TechnicalStockInfo(OtasID, function(sPrintString){
          objGetTechnicalInfo.emit(':tell', sPrintString);
          console.log(sPrintString + "\n");
        })
  },

  'GetPortfolioMetrics': function(){
      var objGetPortfolioMetrics = this;
      myFunctions.GetPortfolioMetrics(objGetPortfolioMetrics.event.request.intent.slots.portfolioName.value, function(sPrintString){
        objGetPortfolioMetrics.emit(':tell', sPrintString);
        console.log(sPrintString + "\n");
      })
  },
}
