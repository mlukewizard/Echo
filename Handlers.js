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
        try{
        var globalThis = this;
        globalThis.attributes['resumePoint'] = "A0"
        this.emit(':ask', "Welcome to Oh Tas, how can I help?");
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in LaunchIntent. " + err.stack);}
    },

    //-------------------------------------------------
    //Stock focussed functions
    //-------------------------------------------------

    'GetGeneralStockInfo': function () {
        try{
        var globalThis = this;
        alexaFunctions.GetGeneralStockInfo(globalThis, miscFunctions.interGenericCallBack) 
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in GetGeneralStockInfo. " + err.stack);}
    },

    'GetStockNaturalLanguage': function () {
        try{
        var globalThis = this;
        alexaFunctions.GetStockNaturalLanguage(globalThis, miscFunctions.interGenericCallBack)
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in GetStockNaturalLanguage. " + err.stack);}
    },

    'GetTechnicalStockInfo': function () {
        try{
        var globalThis = this;
        alexaFunctions.GetTechnicalStockInfo(globalThis, miscFunctions.interGenericCallBack)
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in GetTechnicalStockInfo. " + err.stack);}
    },

    //-------------------------------------------------
    //Portfolio focussed functions
    //-------------------------------------------------
    'GetMyPortfolios': function () {
        try{
        var globalThis = this;
        alexaFunctions.GetMyPortfolios(globalThis, miscFunctions.interGenericCallBack)
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in GetMyPortfolios. " + err.stack);}
    },

    'PnL': function () {
        var globalThis = this;
        try{
        alexaFunctions.PnL(globalThis, miscFunctions.interGenericCallBack)
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in PnL. " + err.stack);}
    },

    'GetPortfolioMetrics': function () {
        try{
        var globalThis = this;
        alexaFunctions.GetPortfolioMetrics(globalThis, miscFunctions.interGenericCallBack)
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in GetPortfolioMetrics. " + err.stack);}
    },

    'SetDefaultPortfolio': function () {
        try{
        var globalThis = this;
        alexaFunctions.SetDefaultPortfolio(globalThis, miscFunctions.interGenericCallBack)
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in SetDefaultPortfolio. " + err.stack);}
    },

    'GetHighestInPortfolio': function () {
        try{
        var globalThis = this;
        alexaFunctions.GetHighOrLowInPortfolio(globalThis, "High", miscFunctions.interGenericCallBack)
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in GetHighestInPortfolio. " + err.stack);}
    },

    'GetLowestInPortfolio': function () {
        try{
        var globalThis = this;
        alexaFunctions.GetHighOrLowInPortfolio(globalThis, "Low", miscFunctions.interGenericCallBack)
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in GetLowestInPortfolio. " + err.stack);}
    },

    'GetPortfolioNaturalLanguage': function () {
        try{
        var globalThis = this;
        alexaFunctions.GetPortfolioNaturalLanguage(globalThis, miscFunctions.interGenericCallBack)
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in GetPortfolioNaturalLanguage. " + err.stack);}
    },

    'GetListAlerts': function () {
        var globalThis = this;
        try{
        alexaFunctions.GetListAlerts(globalThis, miscFunctions.interGenericCallBack)
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in GetListAlerts. " + err.stack);}
    },
    
    //----Only helper functions from here onwards----
    'userYes': function () {
        try{
        var globalThis = this;
        globalThis.attributes['YesVsNo'] = "UserSaysYes";
        var workingSkill = globalThis.attributes['currentFunc']
        globalThis.emit(workingSkill);
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in userYes. " + err.stack);}
    },

    'userNo': function () {
        try{
        var globalThis = this;
        globalThis.attributes['YesVsNo'] = "UserSaysNo";
        var workingSkill = globalThis.attributes['currentFunc']
        globalThis.emit(workingSkill);
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in userNo. " + err.stack);}
    },

    'SpecifyTicker': function(){
        try{
        var globalThis = this;
        globalThis.attributes['Ticker'] = globalThis.event.request.intent.slots.ticker.value
        var workingSkill = globalThis.attributes['currentFunc']
        globalThis.emit(workingSkill);
    }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in SpecifyTicker. " + err.stack);}
    }
}

exports.Handlers = handlers;