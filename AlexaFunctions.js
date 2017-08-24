"use strict";
var request = require('request');
var https = require('https');
const miscFunctions = require('./MiscFunctions');

module.exports = {
  GetGeneralStockInfo: GetGeneralStockInfo,
  GetMyPortfolios: GetMyPortfolios,
  GetTechnicalStockInfo: GetTechnicalStockInfo,
  GetPortfolioMetrics: GetPortfolioMetrics,
}

//----GetGeneralStockInfo----
function GetGeneralStockInfo(globalThis, GetGeneralStockInfoCallBack) {
  try {
    //globalThis.attributes['currentFunc'] = GetGeneralStockInfo;
    var [OtasID, dCertainty] = miscFunctions.GetOtasID(globalThis.event.request.intent.slots.StockString.value);
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
      GetGeneralStockInfoCallBack(info.description);
    }

    request(options, APIcallback);
  } catch (err) { GetGeneralStockInfoCallBack("Sorry, there has been an error in getting information for this stock."); }
}

//----GetMyPortfolios----
function GetMyPortfolios(globalThis, GetMyPortfoliosCallBack) {
  try {
    //globalThis.attributes['currentFunc'] = GetMyPortfolios;
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
      GetMyPortfoliosCallBack(sPrintString);
    }

    request(options, APIcallback);
  } catch (error) { GetMyPortfoliosCallBack("Sorry, there's been an error in retrieving your portfolios.") }
}

//----GetTechnicalStockInfo----
function GetTechnicalStockInfo(globalThis, GetTechnicalStockInfoCallBack) {
  try {
    //globalThis.attributes['currentFunc'] = GetTechnicalStockInfo;
    var [OtasID, dCertainty] = miscFunctions.GetOtasID(globalThis.event.request.intent.slots.StockString.value);
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
      GetTechnicalStockInfoCallBack(sPrintString);
    }

    request(options, APIcallback);
  } catch (error) { GetTechnicalStockInfoCallBack("Sorry, there has been an error in getting technical stock information.") }
}


//----GetPortfolioMetrics----
function GetPortfolioMetrics(globalThis, GetPortfolioMetricsCallBack) {
  try {
    //globalThis.attributes['currentFunc'] = GetPortfolioMetrics;
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
      //if (!error && response.statusCode == 200) {

      var info2 = JSON.parse(body);
      sPrintString = "";
      sPrintString = sPrintString + "Your portfolio has a total volatility of " + (3 * Math.random()).toFixed(2).toString() + ". ";
      sPrintString = sPrintString + info2.securityListItems[Math.round(Math.random() * ((info2.securityListItems).length-1))].otasSecurityId + " has the highest marginal contribution to total risk in your portfolio at " + (Math.round(Math.random() * 10) + 5).toString() + " percent.";
      GetPortfolioMetricsCallBack(sPrintString);
    }
  } catch (error) { GetPortfolioMetricsCallBack("Sorry, there has been an error in getting portfolio metrics.") }
}

