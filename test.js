console.log("Program started")
const myFunctions = require('./functions');
var request = require('request');
var https = require('https')

var string = myFunctions.GetOtasID("bp");
console.log(string);


console.log("Program ended")