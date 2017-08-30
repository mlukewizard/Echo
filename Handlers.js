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

    'GetGeneralStockInfo': function () {
        try{
        var globalThis = this;
        alexaFunctions.GetGeneralStockInfo(globalThis, miscFunctions.GenericCallBack) 
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in GetGeneralStockInfo. " + err.stack);}
    },

    'GetMyPortfolios': function () {
        try{
        var globalThis = this;
        alexaFunctions.GetMyPortfolios(globalThis, miscFunctions.GenericCallBack)
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in GetMyPortfolios. " + err.stack);}
    },

    'PnL': function () {
        var globalThis = this;
        try{
        alexaFunctions.PnL(globalThis, miscFunctions.GenericCallBack)
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in PnL. " + err.stack);}
    },

    'GetTechnicalStockInfo': function () {
        try{
        var globalThis = this;
        alexaFunctions.GetTechnicalStockInfo(globalThis, miscFunctions.GenericCallBack)
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in GetTechnicalStockInfo. " + err.stack);}
    },

    'GetPortfolioMetrics': function () {
        try{
        var globalThis = this;
        alexaFunctions.GetPortfolioMetrics(globalThis, miscFunctions.GenericCallBack)
        }catch(err){globalThis.emit(':tell', "Sorry, there has been an error in GetPortfolioMetrics. " + err.stack);}
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