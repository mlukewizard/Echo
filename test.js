console.log("Program started")
const myFunctions = require('./functions');
var request = require('request');
var https = require('https')

var string = myFunctions.GetOtasID("glencore");
myFunctions.TechnicalStockInfo(string, function(stock){
         console.log(stock);
        });

console.log("Program ended")