console.log("Program started")
const myFunctions = require('./functions');

var request = require('request');
var https = require('https')

var OtasID = myFunctions.GetOtasID("bp");
console.log("GetOtasID test passed");

myFunctions.TechnicalStockInfo(OtasID, function(sPrintString){
        if (sPrintString.substring(0,10) == " With resp"){
                console.log("TechnicalStockInfo test passed");
        }
        });

myFunctions.StockInfo(OtasID, function(sPrintString){
        if (sPrintString.substring(0,10) == "BP p.l.c. "){
                console.log("StockInfo test passed");
        }
        });

myFunctions.GetMyPortfolios(function(sPrintString){
        if (sPrintString.substring(0,10) == "The portfo"){
                console.log("GetMyPortfolios test passed");
        }
        });