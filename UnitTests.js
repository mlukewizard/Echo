console.log("Program started");

"use strict";

const alexaFunctions = require('./AlexaFunctions');
const miscFunctions = require('./MiscFunctions');
const Handlers = require('./Handlers.js');

const handlers = Handlers.Handlers;

var request = require('request');
var https = require('https')

var fs = require('fs');

//Initiates logging functionality
fs.truncate("./ProgramLog.txt", 0)


var globalThis = {};
globalThis.event = {}
globalThis.event.request = {}
globalThis.event.request.intent = {}
globalThis.event.request.intent.slots = {}
globalThis.event.request.intent.slots.portfolioName = {}
globalThis.event.request.intent.slots.portfolioName.value = "lukes personal portfolio"
globalThis.event.request.intent.slots.StockString = {}
globalThis.event.request.intent.slots.StockString.value = "vodafone group"
globalThis.event.request.intent.slots.lookback = {}
globalThis.event.request.intent.slots.lookback.value = "this manth"
globalThis.event.request.intent.slots.naturalLanguageParameter = {}
globalThis.event.request.intent.slots.naturalLanguageParameter.value = "Yr to Date Relative Return"
globalThis.event.request.intent.slots.dailyFlagParameter = {}
globalThis.event.request.intent.slots.dailyFlagParameter.value = "volotility"
globalThis.attributes = {}
globalThis.attributes['resumePoint'] = "A0"


//----Tests from miscFunctions----
miscFunctions.StockDailyFlagsFromAPI("OT.VOD.S", function(flagsInfo){
    miscFunctions
    if (flagsInfo.cds.flagType === "cds"){console.log("GetStockDailyFlags test passed")}else{
        console.log("GetStockDailyFlags test failed")}
})

miscFunctions.StockNaturalLanguageFromAPI("OT.VOD.S", function(naturalLanguageInfo){
    if (naturalLanguageInfo.cds.topic === "CDS"){console.log("GetStockDailyFlags test passed")}else{
        console.log("GetStockDailyFlags test failed")}
})

miscFunctions.GetPortfolioEntry("portfolioviaapi" ,function(flagInfo){
    if (flagInfo.securityListName === "PortfolioViaAPI"){console.log("GetPortfolioEntry test passed")}else{
        console.log("GetPortfolioEntry test failed")}
})

var [OtasID, sPredictedName, dCertainty, dSecondCertainty] = miscFunctions.GetOtasID("vodafone group");
if (OtasID === "OT.VOD.S") {console.log("GetOtasID test passed");}
else {console.log("GetOtasID test failed");}

var [OtasID, sPredictedName, dCertainty] = miscFunctions.GetOtasIDFromTicker("VOD LN");
if (OtasID === "OT.VOD.S") {console.log("GetOtasIDFromTicker test passed");}
else {console.log("GetOtasIDFromTicker test failed");}

var [sPredictedName, dCertainty] = miscFunctions.GetStockName("OT.VOD.S")
if (sPredictedName === "Vodafone Group") {console.log("GetStockName test passed");}
else {console.log("GetStockName test failed");}


//----Tests from alexaFunctions----
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
alexaFunctions.SetDefaultPortfolio(globalThis, function (sPrintString) {
        if (sPrintString.substring(0, 10) === "Your defau") { console.log("SetDefaultPortfolio test passed"); }
        else { console.log("SetDefaultPortfolio test failed"); }
})

globalThis.attributes['resumePoint'] = "A0"
alexaFunctions.PnL(globalThis, function (sPrintString) {
        if (sPrintString.substring(0, 10) === "Your P and") { console.log("PnL test passed"); }
        else { console.log("PnL test failed"); }
})

globalThis.attributes['resumePoint'] = "A0"
alexaFunctions.GetHighOrLowInPortfolio(globalThis, "High", function (sPrintString) {
        if (sPrintString.substring(0, 22) === "The stock with the hig") {console.log("GetHighestInPortfolio test passed");}
        else { console.log("GetHighestInPortfolio test failed"); }
});

globalThis.attributes['resumePoint'] = "A0"
alexaFunctions.GetHighOrLowInPortfolio(globalThis, "Low", function (sPrintString) {
        if (sPrintString.substring(0, 22) === "The stock with the low") { console.log("GetLowestInPortfolio test passed"); }
        else { console.log("GetLowestInPortfolio test failed"); }
})

globalThis.attributes['resumePoint'] = "A0"
alexaFunctions.GetStockNaturalLanguage(globalThis, function (sPrintString) {
        if (sPrintString.substring(0, 10) === "Year-to-da") { console.log("GetStockNaturalLanguage test passed"); }
        else { console.log("GetStockNaturalLanguage test failed"); }
})


/*
var options = {
    "rejectUnauthorized": false,
    url: 'http://api-dev.otastech.com/v1.11.3/stocks',
    headers: {
        'Authorization': 'ADE2C684A57BA4AB25542F57B5E5B'
    }
};

function APIcallback(error, response, body) {
    var info = JSON.parse(body);
    string = ""
    info.forEach(function (element) {
        processedName = element.name.replace(/[()'"]/g, '');
        processedName = processedName.replace(/&/g, ' and ');
        processedName = processedName.replace(/\+/g, ' and ');
        processedName = processedName.replace(/-/g, ' ');
        processedName = processedName.replace(/\s\s/g, ' ');
        string = string + "{ Name: \"" + processedName + "\", BBTicker: \"" + element.ticker + "\", OtasID: \"" + element.otasSecurityId + "\"}," + "\r\n"
    })
    miscFunctions.Log(string)
    console.log("here")
}

request(options, APIcallback);
*/

