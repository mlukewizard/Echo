console.log("Program started");

"use strict";

const alexaFunctions = require('./AlexaFunctions');
const miscFunctions = require('./MiscFunctions');
const Handlers = require('./Handlers.js');

const handlers = Handlers.Handlers;

var request = require('request');
var https = require('https')

/*
var globalThis = {};
globalThis.event = {}
globalThis.event.request = {}
globalThis.event.request.intent = {}
globalThis.event.request.intent.slots = {}
globalThis.event.request.intent.slots.portfolioName = {}
globalThis.event.request.intent.slots.portfolioName.value = "PortfolioViaAPI"
globalThis.event.request.intent.slots.StockString = {}
globalThis.event.request.intent.slots.StockString.value = "asdf"
globalThis.event.request.intent.slots.portfolioName = {}
globalThis.attributes = {}
globalThis.attributes['resumePoint'] = "A0"

var [OtasID, sPredictedName, dCertainty] = miscFunctions.GetOtasID("bp");
if (OtasID === "OT.BP.S") {console.log("GetOtasID test passed");}
else {console.log("GetOtasID test failed");}

alexaFunctions.GetTechnicalStockInfo(globalThis, function (sPrintString) {
        if (sPrintString.substring(0, 10) === " With resp") {console.log("GetTechnicalStockInfo test passed");}
        else { console.log("GetTechnicalStockInfo test failed"); }
});

alexaFunctions.GetGeneralStockInfo(globalThis, function (sPrintString) {
        if (sPrintString.substring(0, 10) === "BP p.l.c. ") {console.log("GetGeneralStockInfo test passed");}
        else { console.log("GetGeneralStockInfo test failed"); }
});

alexaFunctions.GetMyPortfolios(globalThis, function (sPrintString) {
        if (sPrintString.substring(0, 10) === "The portfo") {console.log("GetMyPortfolios test passed");}
        else { console.log("GetMyPortfolios test failed"); }
});

alexaFunctions.GetPortfolioMetrics(globalThis, function (sPrintString) {
        if (sPrintString.substring(0, 10) === "Your portf") { console.log("GetPortfolioMetrics test passed"); }
        else { console.log("GetPortfolioMetrics test failed"); }
})
*/

switch (true){
    case true:{
        console.log("Case1")}
    case false:{
        console.log("Case2")}
    case true:{
        console.log("Case3")}
}
