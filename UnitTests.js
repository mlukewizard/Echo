console.log("Program started");

"use strict";

const alexaFunctions = require('./AlexaFunctions');
const miscFunctions = require('./MiscFunctions');
const Handlers = require('./Handlers.js');

const handlers = Handlers.Handlers;

var request = require('request');
var https = require('https')

var globalThis = {};
globalThis.event = {}
globalThis.event.request = {}
globalThis.event.request.intent = {}
globalThis.event.request.intent.slots = {}
globalThis.event.request.intent.slots.portfolioName = {}
globalThis.event.request.intent.slots.portfolioName.value = "PortfolioViaAPI"

var OtasID = miscFunctions.GetOtasID("bp");
if (OtasID == "OT.BP.S") {console.log("GetOtasID test passed");}
else {console.log("GetOtasID test failed");}

alexaFunctions.TechnicalStockInfo(globalThis, OtasID, function (sPrintString) {
        if (sPrintString.substring(0, 10) == " With resp") {console.log("TechnicalStockInfo test passed");}
        else { console.log("TechnicalStockInfo test failed"); }
});

alexaFunctions.StockInfo(globalThis, OtasID, function (sPrintString) {
        if (sPrintString.substring(0, 10) == "BP p.l.c. ") {console.log("StockInfo test passed");}
        else { console.log("StockInfo test failed"); }
});

alexaFunctions.GetMyPortfolios(globalThis, function (sPrintString) {
        if (sPrintString.substring(0, 10) == "The portfo") {console.log("GetMyPortfolios test passed");}
        else { console.log("GetMyPortfolios test failed"); }
});

alexaFunctions.GetPortfolioMetrics(globalThis, function (sPrintString) {
        if (sPrintString.substring(0, 10) == "Your portf") { console.log("GetPortfolioMetrics test passed"); }
        else { console.log("GetPortfolioMetrics test failed"); }
})
