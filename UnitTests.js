console.log("Program started");
"use strict";
const alexaFunctions = require('./AlexaFunctions');
const miscFunctions = require('./MiscFunctions');

var request = require('request');
var https = require('https')

var OtasID = miscFunctions.GetOtasID("bp");
if (OtasID == "OT.BP.S") {console.log("GetOtasID test passed");}
else {console.log("GetOtasID test failed");}

alexaFunctions.TechnicalStockInfo(OtasID, function (sPrintString) {
        if (sPrintString.substring(0, 10) == " With resp") {console.log("TechnicalStockInfo test passed");}
        else { console.log("TechnicalStockInfo test failed"); }
});

alexaFunctions.StockInfo(OtasID, function (sPrintString) {
        if (sPrintString.substring(0, 10) == "BP p.l.c. ") {console.log("StockInfo test passed");}
        else { console.log("StockInfo test failed"); }
});

alexaFunctions.GetMyPortfolios(function (sPrintString) {
        if (sPrintString.substring(0, 10) == "The portfo") {console.log("GetMyPortfolios test passed");}
        else { console.log("GetMyPortfolios test failed"); }
});

alexaFunctions.GetPortfolioMetrics("PortfolioViaAPI", function (sPrintString) {
        if (sPrintString.substring(0, 10) == "Your portf") { console.log("GetPortfolioMetrics test passed"); }
        else { console.log("GetPortfolioMetrics test failed"); }
})
