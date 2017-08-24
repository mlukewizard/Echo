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
        var globalThis = this;
        globalThis.attributes['resumePoint'] = "A0"
        this.emit(':ask', "Welcome to Oh Tas, how can I help?");
    },

    'GetGeneralStockInfo': function () {
        var globalThis = this;
        alexaFunctions.GetGeneralStockInfo(globalThis, function (sPrintString, bTerminate)  {
            if (bTerminate){
            globalThis.emit(':tell', sPrintString);
            console.log(sPrintString + "\n");
            }else{
            globalThis.emit(':ask', sPrintString);
            console.log(sPrintString + "\n"); 
            }
        })
    },

    'GetMyPortfolios': function () {
        var globalThis = this;
        alexaFunctions.GetMyPortfolios(globalThis, function (sPrintString, bTerminate) {
            if (bTerminate){
            globalThis.emit(':tell', sPrintString);
            console.log(sPrintString + "\n");
            }else{
            globalThis.emit(':ask', sPrintString);
            console.log(sPrintString + "\n"); 
            }
        })
    },

    'GetTechnicalStockInfo': function () {
        var globalThis = this;
        alexaFunctions.GetTechnicalStockInfo(globalThis, function (sPrintString, bTerminate)  {
            if (bTerminate){
            globalThis.emit(':tell', sPrintString);
            console.log(sPrintString + "\n");
            }else{
            globalThis.emit(':ask', sPrintString);
            console.log(sPrintString + "\n"); 
            }
        })
    },

    'GetPortfolioMetrics': function () {
        var globalThis = this;
        alexaFunctions.GetPortfolioMetrics(globalThis, function (sPrintString, bTerminate)  {
            if (bTerminate){
            globalThis.emit(':tell', sPrintString);
            console.log(sPrintString + "\n");
            }else{
            globalThis.emit(':ask', sPrintString);
            console.log(sPrintString + "\n"); 
            }
        })
    },
    //----Only helper functions from here onwards----
    'userYes': function () {
        var globalThis = this;
        globalThis.attributes['YesVsNo'] = "UserSaysYes";
        var workingSkill = globalThis.attributes['currentFunc']
        globalThis.emit(workingSkill);
    },

    'userNo': function () {
        var globalThis = this;
        globalThis.attributes['YesVsNo'] = "UserSaysNo";
        var workingSkill = globalThis.attributes['currentFunc']
        globalThis.emit(workingSkill);
    },

    'SpecifyTicker': function(){
        var globalThis = this;
        globalThis.attributes['Ticker'] = globalThis.event.request.intent.slots.ticker.value
        var workingSkill = globalThis.attributes['currentFunc']
        globalThis.emit(workingSkill);
    }
}

exports.Handlers = handlers;