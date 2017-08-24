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

    'GetGeneralStockInfo': function () {
        var globalThis = this;
        var Print = alexaFunctions.GetGeneralStockInfo(globalThis, function (sPrintString) {
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

    'GetTechnicalStockInfo': function () {
        var globalThis = this;
        alexaFunctions.GetTechnicalStockInfo(globalThis, function (sPrintString) {
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

    'userYes': function () {
        var globalThis = this;
        globalThis.attributes['YesVsNo'] = "yes";
        var workingSkill = globalThis.attributes['currentFunc']
        globalThis.emit(workingSkill);
    },

    'userNo': function () {
        var globalThis = this;
        globalThis.attributes['YesVsNo'] = "no";
        var workingSkill = globalThis.attributes['currentFunc']
        globalThis.emit(workingSkill);
    },
}

exports.Handlers = handlers;