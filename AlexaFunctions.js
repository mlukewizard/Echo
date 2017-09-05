"use strict";
var request = require('request');
var https = require('https');
const Lists = require('./Lists');
const miscFunctions = require('./MiscFunctions');

module.exports = {
  GetGeneralStockInfo: GetGeneralStockInfo,
  GetMyPortfolios: GetMyPortfolios,
  GetTechnicalStockInfo: GetTechnicalStockInfo,
  SetDefaultPortfolio: SetDefaultPortfolio,
  PnL: PnL,
  GetHighOrLowInPortfolio: GetHighOrLowInPortfolio,
  GetStockNaturalLanguage: GetStockNaturalLanguage,
}

var stockList = Lists.StockDatabase;
var naturalLanguageTopics = Lists.naturalLanguageTopics;
var dailyFlagTopics = Lists.dailyFlagTopics;

//----GetGeneralStockInfo----
function GetGeneralStockInfo(globalThis, GetGeneralStockInfoCallBack) {
  //Checks if its the first time the function has been called, sets the current function to this function and initiates the storage object and gives a warning if another function was running
  miscFunctions.InterLaunchChecks(globalThis, GetGeneralStockInfoCallBack, "GetGeneralStockInfo")

  //Abstracts the identification of the OTAS ID conversation
  var OtasID = miscFunctions.InterRobustGetOtasID(globalThis, GetGeneralStockInfoCallBack, "GetGeneralStockInfo")

  //If you get to here then you've got a correct OtasID and you can just continue
  if (globalThis.attributes['resumePoint'] === "A2" || globalThis.attributes['resumePoint'] === "A1" || globalThis.attributes['resumePoint'] === "A0") { globalThis.attributes['resumePoint'] = "A3" };
  var options = {
    "rejectUnauthorized": false,
    url: 'https://api-dev.otastech.com/v1.11.1/stock/' + OtasID + '/',
    headers: {
      'Authorization': 'ADE2C684A57BA4AB25542F57B5E5B',
      'Username': 'luke.markham@otastechnology.com',
      'Password': 'Otastech1!'
    }
  };

  function APIcallback(error, response, body) {
    //Not 100% sure about this line
    if (globalThis.attributes['resumePoint'] === "A2" || globalThis.attributes['resumePoint'] === "A1" || globalThis.attributes['resumePoint'] === "A0") { globalThis.attributes['resumePoint'] = "A3" };

    var info = JSON.parse(body);
    var sGeneralInfo = info.description
    //If the string is really long, split it then read some then ask the user if they want to continue
    if (sGeneralInfo.length > 250) {

      var sFirstBit = sGeneralInfo.substring(0, sGeneralInfo.indexOf(". ", 150) + 2)
      var sLastBit = sGeneralInfo.substring(sGeneralInfo.indexOf(". ", 150) + 2, sGeneralInfo.length)

      //If nothings been read yet, then read the start
      if (globalThis.attributes['resumePoint'] === "A3") {
        globalThis.attributes['resumePoint'] = "A4"
        GetGeneralStockInfoCallBack(sFirstBit + ". Would you like for me to continue?", globalThis, false)

        //If the first bit has already been read then take action based on whether the user wants more or not  
      } else if (globalThis.attributes['resumePoint'] === "A4") {
        if (globalThis.attributes['YesVsNo'] === "UserSaysNo") {
          globalThis.attributes['YesVsNo'] = "Null"
          GetGeneralStockInfoCallBack("Ok", globalThis, true)
        } else if (globalThis.attributes['YesVsNo'] === "UserSaysYes") {
          globalThis.attributes['YesVsNo'] = "Null"
          GetGeneralStockInfoCallBack(sLastBit, globalThis, true)
        }
      }

      //Executes if the string is short enough that you can just say it without needing to ask to continue  
    } else {
      GetGeneralStockInfoCallBack(sGeneralInfo, globalThis, true);
    }
  }

  request(options, APIcallback);
}

//----GetTechnicalStockInfo----
function GetTechnicalStockInfo(globalThis, GetTechnicalStockInfoCallBack) {
  //Checks if its the first time the function has been called, sets the current function to this function and initiates the storage object and gives a warning if another function was running
  miscFunctions.InterLaunchChecks(globalThis, GetTechnicalStockInfoCallBack, "GetTechnicalStockInfo")

  //Abstracts the identification of the OTAS ID conversation
  var OtasID = miscFunctions.InterRobustGetOtasID(globalThis, GetTechnicalStockInfoCallBack, "GetTechnicalStockInfo")

  miscFunctions.StockNaturalLanguageFromAPI(OtasID, function (naturalLanguageReport) {
    var sPrintString = ""
    for (var property in naturalLanguageReport) {
      sPrintString = sPrintString + " With respect to " + naturalLanguageReport[property].topic + ", " + naturalLanguageReport[property].text;
    }
    GetTechnicalStockInfoCallBack(sPrintString, globalThis, true);
  })
}

//----GetMyPortfolios----
function GetMyPortfolios(globalThis, GetMyPortfoliosCallBack) {
  //globalThis.emit(':tell', "sPrintString");
  //Checks if its the first time the function has been called, sets the current function to this function and initiates the storage object and gives a warning if another function was running
  miscFunctions.InterLaunchChecks(globalThis, GetMyPortfoliosCallBack, "GetMyPortfolios")

  var options = {
    "rejectUnauthorized": false,
    url: 'https://api-dev.otastech.com/v1.11.1/lists?type=portfolio',
    headers: {
      'Authorization': 'ADE2C684A57BA4AB25542F57B5E5B',
      'Username': 'luke.markham@otastechnology.com',
      'Password': 'Otastech1!'
    }
  };

  function APIcallback(error, response, body) {
    var info = JSON.parse(body);
    var sPrintString = "The portfolios you have available are as follows. ";
    for (var i = 0; i < info.length; i++) {
      sPrintString = sPrintString + info[i].securityListName + ", ";
    }
    GetMyPortfoliosCallBack(sPrintString, globalThis, true);
  }

  request(options, APIcallback);
}

//----SetDefaultPortfolio----
function SetDefaultPortfolio(globalThis, SetDefaultPortfolioCallBack) {
  //Checks if its the first time the function has been called, sets the current function to this function and initiates the storage object and gives a warning if another function was running
  miscFunctions.InterLaunchChecks(globalThis, SetDefaultPortfolioCallBack, "SetDefaultPortfolio")

  const secListName = globalThis.event.request.intent.slots.portfolioName.value

    SetDefaultPortfolioCallBack("Your default portfolio has been set to " + secListName, globalThis, true);
}

//----PnL----
function PnL(globalThis, PnLCallBack) {

  //Checks if its the first time the function has been called, sets the current function to this function and initiates the storage object and gives a warning if another function was running
  miscFunctions.InterLaunchChecks(globalThis, PnLCallBack, "PnL")

  const userlookBack = globalThis.event.request.intent.slots.lookback.value

  var lookBackOptions = ["today", "this week", "this month", "year to date", "this year"]

  var Options = [];
  lookBackOptions.forEach(function (element) {
    Options.push(miscFunctions.Similarity(element, userlookBack));
  }, this);

  var index = Options.indexOf(Math.max(...Options))
  var lookBack = lookBackOptions[index]


  if (lookBack == "today") { var parameterLookBack = "returnAbsolute1d" }
  else if (lookBack == "this week") { var parameterLookBack = "returnAbsolute1w" }
  else if (lookBack == "month to date") { var parameterLookBack = "returnAbsoluteMtd" }
  else if (lookBack == "this month") { var parameterLookBack = "returnAbsolute1m" }
  else if (lookBack == "year to date") { var parameterLookBack = "returnAbsoluteYtd" }
  else if (lookBack == "this year") { var parameterLookBack = "returnAbsolute1y" }

  const secListName = globalThis.event.request.intent.slots.portfolioName.value

  var Options = [];

  miscFunctions.GetPortfolioEntry(secListName, function (portfolioEntry) {
    var listID = portfolioEntry.securityListId
    var options = {
      "rejectUnauthorized": false,
      url: 'https://api-dev.otastech.com/v1.11.1/list/portfolio/' + listID + '/dailyflags',
      headers: {
        'Authorization': 'ADE2C684A57BA4AB25542F57B5E5B',
        'Username': 'luke.markham@otastechnology.com',
        'Password': 'Otastech1!'
      }
    };

    function APIcallback(error, response, body) {
      var info = JSON.parse(body);
      var portfolioStats = []
      var i = 0;
      //Looping throught each portfolio item, each item is a stock
      info.forEach(function (portfolioItem) {
        if (portfolioItem.dailyFlags.hasOwnProperty("performance")) {
          var topic = portfolioItem.dailyFlags["performance"]
          try { portfolioStats.push({ stockName: portfolioItem.otasSecurityId, stat: topic[parameterLookBack] }) } catch (err) { portfolioStats.push({ stockName: portfolioItem.otasSecurityId, stat: null }) }
        } else { portfolioStats.push({ stockName: portfolioItem.otasSecurityId, stat: null }) }
        //As of here you have a list of otas IDs and their returns (portfolioStats)
      })

      var PnL = 0
      portfolioStats.forEach(function (returnItem) {
        var stockAmount = portfolioEntry.securityListItems.find(function (element) { return element.otasSecurityId == returnItem.stockName; }).amount
        //var priceChange = portfolioStats.find(function (element) { return element.stockName == returnItem.stockName; }).stat
        PnL = PnL + stockAmount * returnItem.stat / 100   //*priceChange
      })

      PnLCallBack("Your P and L " + lookBack + " is $" + Math.round(PnL), globalThis, true)

    }
    request(options, APIcallback);
  })
}

//----GetHighOrLowInPortfolio----
function GetHighOrLowInPortfolio(globalThis, HighOrLow, GetHighOrLowInPortfolioCallBack) {
  //Checks if its the first time the function has been called, sets the current function to this function and initiates the storage object and gives a warning if another function was running
  miscFunctions.InterLaunchChecks(globalThis, GetHighOrLowInPortfolioCallBack, "GetHighOrLowInPortfolio")

  const secListName = globalThis.event.request.intent.slots.portfolioName.value

  var userDailyFlagParameter = globalThis.event.request.intent.slots.dailyFlagParameter.value;

  var Options = [];
  dailyFlagTopics.forEach(function (element) {
    Options.push(miscFunctions.Similarity(element.UserInvocation, userDailyFlagParameter));
  }, this);
  var index = Options.indexOf(Math.max(...Options))
  var actualDailyFlagParameter = dailyFlagTopics[index].UserInvocation
  var OtasDailyFlagParameter = dailyFlagTopics[index].OtasInvocation

  var scoper = ""
  if (OtasDailyFlagParameter === "directorDealings") { GetHighOrLowInPortfolioCallBack("Director dealings isnt quantifiable", globalThis, true); }
  else if (OtasDailyFlagParameter === "epsMomentum") { scoper = "percentile" }
  else if (OtasDailyFlagParameter === "performance") { scoper = "returnAbsolute1d" }
  else { scoper = "currentLevel" }

  miscFunctions.GetPortfolioEntry(secListName, function (portfolioEntry) {
    var listID = portfolioEntry.securityListId


    var options = {
      "rejectUnauthorized": false,
      url: 'https://api-dev.otastech.com/v1.11.1/list/portfolio/' + listID + '/dailyflags',
      headers: {
        'Authorization': 'ADE2C684A57BA4AB25542F57B5E5B',
        'Username': 'luke.markham@otastechnology.com',
        'Password': 'Otastech1!'
      }
    };

    function APIcallback(error, response, body) {
      var info = JSON.parse(body);
      var portfolioStats = [],
        i = 0;
      //Looping throught each portfolio item, each item is a stock
      info.forEach(function (portfolioItem) {
        if (portfolioItem.dailyFlags.hasOwnProperty(OtasDailyFlagParameter)) {
          var topic = portfolioItem.dailyFlags[OtasDailyFlagParameter]
          try { portfolioStats.push({ stockName: portfolioItem.otasSecurityId, stat: topic[scoper] }) } catch (err) { portfolioStats.push({ stockName: portfolioItem.otasSecurityId, stat: null }) }
        } else { portfolioStats.push({ stockName: portfolioItem.otasSecurityId, stat: null }) }

        if (++i === portfolioEntry.securityListItems.length) {
          //Calculates either the maximum value of the stat or the minimum value
          if (HighOrLow == "High") { var statVal = Math.max.apply(Math, portfolioStats.map(function (element) { if (element.stat != null) { return element.stat } else { return 0 } })) }
          else if (HighOrLow == "Low") { var statVal = Math.min.apply(Math, portfolioStats.map(function (element) { if (element.stat != null) { return element.stat } else { return 10000000 } })) }

          //Gets the stock name which has this value
          var stockName = portfolioStats.find(function (element) { return element.stat == statVal; }).stockName

          //Print an output dependent on the response
          if (HighOrLow == "High") { GetHighOrLowInPortfolioCallBack("The stock with the highest " + actualDailyFlagParameter + " in your portfolio named " + secListName + " is " + miscFunctions.GetStockName(stockName)[0] + " with a value of " + statVal + ".", globalThis, true) }
          else if (HighOrLow == "Low") { GetHighOrLowInPortfolioCallBack("The stock with the lowest " + actualDailyFlagParameter + " in your portfolio named " + secListName + " is " + miscFunctions.GetStockName(stockName)[0] + " with a value of " + statVal + ".", globalThis, true) }
        }
      })
    }

    request(options, APIcallback);
  })
}

//----GetStockNaturalLanguage----
function GetStockNaturalLanguage(globalThis, GetStockNaturalLanguageCallBack) {
  //Checks if its the first time the function has been called, sets the current function to this function and initiates the storage object and gives a warning if another function was running
  miscFunctions.InterLaunchChecks(globalThis, GetStockNaturalLanguageCallBack, "GetStockNaturalLanguage")

  //Abstracts the identification of the OTAS ID conversation
  var OtasID = miscFunctions.InterRobustGetOtasID(globalThis, GetStockNaturalLanguageCallBack, "GetStockNaturalLanguage")

  var userNaturalLanguageParameter = globalThis.event.request.intent.slots.naturalLanguageParameter.value

  var Options = [];
  naturalLanguageTopics.forEach(function (element) {
    Options.push(miscFunctions.Similarity(element.UserInvocation, userNaturalLanguageParameter));
  }, this);
  var index = Options.indexOf(Math.max(...Options))
  var naturalLanguageParameter = naturalLanguageTopics[index].OtasInvocation

  miscFunctions.StockNaturalLanguageFromAPI(OtasID, function (ApiReturnNaturalLanguage) {
    GetStockNaturalLanguageCallBack(ApiReturnNaturalLanguage[naturalLanguageParameter].text, globalThis, true)
  })


}


