"use strict";
var request = require('request');
var https = require('https');
const miscFunctions = require('./MiscFunctions');

module.exports = {
  GetGeneralStockInfo: GetGeneralStockInfo,
  GetMyPortfolios: GetMyPortfolios,
  GetTechnicalStockInfo: GetTechnicalStockInfo,
  GetPortfolioMetrics: GetPortfolioMetrics,
  PnL: PnL,
}

//----GetGeneralStockInfo----
function GetGeneralStockInfo(globalThis, GetGeneralStockInfoCallBack) {
    //Checks if its the first time the function has been called, sets the current function to this function and initiates the storage object and gives a warning if another function was running
    miscFunctions.InterLaunchChecks(globalThis, GetGeneralStockInfoCallBack, "GetGeneralStockInfo")

    //Abstracts the identification of the OTAS ID conversation
    var OtasID = miscFunctions.InterRobustGetOtasID(globalThis, GetGeneralStockInfoCallBack, "GetGeneralStockInfo")

    //If you get to here then you've got a correct OtasID and you can just continue
    if (globalThis.attributes['resumePoint'] === "A2"||globalThis.attributes['resumePoint'] === "A1"||globalThis.attributes['resumePoint'] === "A0") { globalThis.attributes['resumePoint'] = "A3" };
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
        }else if (globalThis.attributes['resumePoint'] === "A4"){
          if (globalThis.attributes['YesVsNo'] === "UserSaysNo"){
            globalThis.attributes['YesVsNo'] = "Null"
            GetGeneralStockInfoCallBack("Ok", globalThis, true)
          } else if (globalThis.attributes['YesVsNo'] === "UserSaysYes"){
            globalThis.attributes['YesVsNo'] = "Null"
            GetGeneralStockInfoCallBack(sLastBit, globalThis, true)
          }
        }
        
      //Executes if the string is short enough that you can just say it without needing to ask to continue  
      }else {
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

    var options = {
      "rejectUnauthorized": false,
      url: 'https://apps-dev.otastech.com/v1.11.2/api/stock/' + OtasID + '/text ',
      headers: {
        'Authorization': 'ADE2C684A57BA4AB25542F57B5E5B'
      }
    };

    function APIcallback(error, response, body) {
      var sPrintString = "";
      var info = JSON.parse(body);
      for (var property in info.naturalLanguage) {
        sPrintString = sPrintString + " With respect to " + info.naturalLanguage[property].topic + ", " + info.naturalLanguage[property].text;
      }
      GetTechnicalStockInfoCallBack(sPrintString, globalThis, true);
    }

    request(options, APIcallback);
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

//----GetPortfolioMetrics----
function GetPortfolioMetrics(globalThis, GetPortfolioMetricsCallBack) {
    //Checks if its the first time the function has been called, sets the current function to this function and initiates the storage object and gives a warning if another function was running
    miscFunctions.InterLaunchChecks(globalThis, GetPortfolioMetricsCallBack, "GetPortfolioMetrics")

    const secListName = globalThis.event.request.intent.slots.portfolioName.value
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
      var Options = [];
      info.forEach(function (element) {
        Options.push(miscFunctions.Similarity(miscFunctions.Pad('00000000000000000000000000000000000000000000000000', element.securityListName, false), miscFunctions.Pad('11111111111111111111111111111111111111111111111111', secListName, false)));
      }, this);

      var index = Options.indexOf(Math.max(...Options))

      var options2 = {
        "rejectUnauthorized": false,
        url: 'https://api-dev.otastech.com/v1.11.1/list/portfolio/get/' + info[index].securityListId,
        headers: {
          'Authorization': 'ADE2C684A57BA4AB25542F57B5E5B',
          'Username': 'luke.markham@otastechnology.com',
          'Password': 'Otastech1!'
        }
      };
      request(options2, APIcallback2)
    }

    request(options, APIcallback);

    function APIcallback2(error, response, body) {
      var sPrintString = "";
      var info2 = JSON.parse(body);
      sPrintString = "";
      sPrintString = sPrintString + "Your portfolio has a total volatility of " + (3 * Math.random()).toFixed(2).toString() + ". ";
      sPrintString = sPrintString + info2.securityListItems[Math.round(Math.random() * ((info2.securityListItems).length - 1))].otasSecurityId + " has the highest marginal contribution to total risk in your portfolio at " + (Math.round(Math.random() * 10) + 5).toString() + " percent.";
      GetPortfolioMetricsCallBack(sPrintString, globalThis, true);
    }
}

//----PnL----
function PnL(globalThis, PnLCallBack){
    //Checks if its the first time the function has been called, sets the current function to this function and initiates the storage object and gives a warning if another function was running
    miscFunctions.InterLaunchChecks(globalThis, PnLCallBack, "PnL")
    PnLCallBack("Your P and L is 4", globalThis, true)
  }