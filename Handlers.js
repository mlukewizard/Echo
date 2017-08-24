"use strict";

const alexaFunctions = require('./AlexaFunctions');
const miscFunctions = require('./MiscFunctions');
var request = require('request');
var https = require('https')

var handlers = {

  'LaunchRequest': function () {
    this.emit('LaunchIntent');
  },

  'LaunchIntent': function () {
    this.emit(':ask', "Welcome to OTAS, how can I help?");
  },

  'GetStockInfo': function () {
    var globalThis = this;
    var OtasID = miscFunctions.GetOtasID(globalThis.event.request.intent.slots.StockString.value);
    var Print = alexaFunctions.StockInfo(globalThis, OtasID, function (sPrintString) {
      globalThis.emit(':tell', sPrintString);
      console.log(sPrintString + "\n");
    })
  },

  'GetMyPortfolios': function () {
    var globalThis = this;
    alexaFunctions.GetMyPortfolios(globalThis, function (sPrintString) {
      globalThis.emit(':tell', sPrintString);
      console.log(sPrintString + "\n");
    })
  },

  'GetTechnicalInfo': function () {
    var globalThis = this;
    var OtasID = miscFunctions.GetOtasID(globalThis.event.request.intent.slots.StockString.value);
    alexaFunctions.TechnicalStockInfo(globalThis, OtasID, function (sPrintString) {
      globalThis.emit(':tell', sPrintString);
      console.log(sPrintString + "\n");
    })
  },

  'GetPortfolioMetrics': function () {
    var globalThis = this;
    alexaFunctions.GetPortfolioMetrics(globalThis, function (sPrintString) {
      globalThis.emit(':tell', sPrintString);
      console.log(sPrintString + "\n");
    })
  },
}

exports.Handlers = handlers;