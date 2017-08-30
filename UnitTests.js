console.log("Program started");

"use strict";

const alexaFunctions = require('./AlexaFunctions');
const miscFunctions = require('./MiscFunctions');
const Handlers = require('./Handlers.js');

const handlers = Handlers.Handlers;

var request = require('request');
var https = require('https')

miscFunctions.GetStockDailyFlags("OT.VOD.S", "volatility" , "mean" ,function(flagInfo){
    console.log(flagInfo)
})

var globalThis = {};
globalThis.event = {}
globalThis.event.request = {}
globalThis.event.request.intent = {}
globalThis.event.request.intent.slots = {}
globalThis.event.request.intent.slots.portfolioName = {}
globalThis.event.request.intent.slots.portfolioName.value = "PortfolioViaAPI"
globalThis.event.request.intent.slots.StockString = {}
globalThis.event.request.intent.slots.StockString.value = "vodafone group"
globalThis.event.request.intent.slots.lookback = {}
globalThis.event.request.intent.slots.lookback.value = "this month"
globalThis.attributes = {}
globalThis.attributes['resumePoint'] = "A0"

var [OtasID, sPredictedName, dCertainty] = miscFunctions.GetOtasID("vodafone group");
if (OtasID === "OT.VOD.S") {console.log("GetOtasID test passed");}
else {console.log("GetOtasID test failed");}

globalThis.attributes['resumePoint'] = "A0"
alexaFunctions.GetTechnicalStockInfo(globalThis, function (sPrintString) {
        if (sPrintString.substring(0, 10) === " With resp") {console.log("GetTechnicalStockInfo test passed");}
        else { console.log("GetTechnicalStockInfo test failed"); }
});

globalThis.attributes['resumePoint'] = "A0"
alexaFunctions.GetGeneralStockInfo(globalThis, function (sPrintString) {
        if (sPrintString.substring(0, 10) === "Vodafone G") {console.log("GetGeneralStockInfo test passed");}
        else { console.log("GetGeneralStockInfo test failed"); }
});

globalThis.attributes['resumePoint'] = "A0"
alexaFunctions.GetMyPortfolios(globalThis, function (sPrintString) {
        if (sPrintString.substring(0, 10) === "The portfo") {console.log("GetMyPortfolios test passed");}
        else { console.log("GetMyPortfolios test failed"); }
});

globalThis.attributes['resumePoint'] = "A0"
alexaFunctions.GetPortfolioMetrics(globalThis, function (sPrintString) {
        if (sPrintString.substring(0, 10) === "Your portf") { console.log("GetPortfolioMetrics test passed"); }
        else { console.log("GetPortfolioMetrics test failed"); }
})

globalThis.attributes['resumePoint'] = "A0"
alexaFunctions.PnL(globalThis, function (sPrintString) {
        if (sPrintString.substring(0, 10) === "Your P and") { console.log("PnL test passed"); }
        else { console.log("PnL test failed"); }
})