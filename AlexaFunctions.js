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
    //Runs if the function has been called before program launched
    if (!globalThis.attributes['resumePoint']) {
      GetGeneralStockInfoCallBack("Oh Tas functions cannot be run without opening Oh Tas first.", true)
    }

    //If this is the first command after the program has launched, then set the currentFunc to this function
    if (globalThis.attributes['resumePoint'] === "A0") {
      globalThis.attributes.GetGeneralStockInfo = {}
      globalThis.attributes.GetGeneralStockInfo['userStockString'] = globalThis.event.request.intent.slots.StockString.value
      globalThis.attributes['currentFunc'] = "GetGeneralStockInfo";
    }

    //Runs if the user calls this function but I was expecting the user to call something else
    if (globalThis.attributes['currentFunc'] != "GetGeneralStockInfo") {
      GetGeneralStockInfoCallBack("You can't call another Oh Tas function if you are already executing one", true)
    }

    //Simply shortening the variable name to make the rest of the code more readable
    var GetGeneralStockInfoCache = globalThis.attributes.GetGeneralStockInfo;

    //Gets OTAS ID given the parameter which is currently stored in the data cache, runs on every iteration
    var [OtasID, sPredictedName, dCertainty] = miscFunctions.GetOtasID(GetGeneralStockInfoCache['userStockString']);
    GetGeneralStockInfoCache['OtasID'] = OtasID

    //Sees if it's the first run and if it is, checks if it's likely that you've managed to get the OtasID right
    if (globalThis.attributes['resumePoint'] === "A0" && dCertainty < 0.6) {
      globalThis.attributes['resumePoint'] = "A1";
      GetGeneralStockInfoCallBack("I'm not sure I understood that stock name correctly, did you mean " + sPredictedName + "?", false)
    }

    //Runs only if this is the second run through, sees if the user has accepted the correction or not
    if (globalThis.attributes['resumePoint'] === "A1") {
      if (globalThis.attributes['YesVsNo'] === "UserSaysNo") { //Executes if the stock estimation is wrong
        GetGeneralStockInfoCache['OtasID'] = "Null";
        globalThis.attributes.GetGeneralStockInfo['userStockString'] = "Null";
        globalThis.attributes['YesVsNo'] = "Null" //Resetting to "Null" to avoid bugs
        globalThis.attributes['resumePoint'] = "A2";
        GetGeneralStockInfoCallBack("I can also find a stock by ticker symbol, do you know it?", false) //offers to specify by stock symbol
      } else if (globalThis.attributes['YesVsNo'] === "UserSaysYes") { //Executes if the stock estimation is correct
        globalThis.attributes['YesVsNo'] = "Null" //Resetting YesVsNo to avoid bugs
      }
    }

    //Runs only if this is the third run through, checks the ticker symbol which the user has given and sees if it matches any in the stock list
    if (globalThis.attributes['resumePoint'] === "A2") {
      if (globalThis.attributes['Ticker']) {
        [OtasID, sPredictedName, dCertainty] = miscFunctions.GetOtasIDFromTicker(globalThis.attributes['Ticker'])
        if (OtasID === null) {
          GetGeneralStockInfoCallBack("I couldn't find that ticker symbol", true) //terminates the dialogue because the ticker symbol didnt match
        }
        else {
          GetGeneralStockInfoCache['OtasID'] = OtasID
        }
      }
      else if (globalThis.attributes['YesVsNo'] === "UserSaysNo") {
        globalThis.attributes['YesVsNo'] = "Null" //Resetting YesVsNo to avoid bugs
        GetGeneralStockInfoCallBack("Ok", true)
      }
      else if (globalThis.attributes['YesVsNo'] === "UserSaysYes") {
        globalThis.attributes['YesVsNo'] = "Null" //Resetting YesVsNo to avoid bugs
        GetGeneralStockInfoCallBack("Cool! In future you can just say it.", false)
      }
    }

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
          GetGeneralStockInfoCallBack(sFirstBit + ". Would you like for me to continue?", false)

        //If the first bit has already been read then take action based on whether the user wants more or not  
        }else if (globalThis.attributes['resumePoint'] === "A4"){
          if (globalThis.attributes['YesVsNo'] === "UserSaysNo"){
            globalThis.attributes['YesVsNo'] = "Null"
            GetGeneralStockInfoCallBack("Ok", true)
          } else if (globalThis.attributes['YesVsNo'] === "UserSaysYes"){
            globalThis.attributes['YesVsNo'] = "Null"
            GetGeneralStockInfoCallBack(sLastBit, true)
          }
        }
        
        //GetGeneralStockInfoCallBack("Splitting string", false)
      //Executes if the string is short enough that you can just say it without needing to ask to continue  
      }else {
        GetGeneralStockInfoCallBack(sGeneralInfo, true);
        //GetGeneralStockInfoCallBack("Not splitting anything", false)
      }
    }

    request(options, APIcallback);
  } catch (err) { GetGeneralStockInfoCallBack("Sorry, there has been an error in getting information for this stock. " + err, true); }
}

//----GetMyPortfolios----
function GetMyPortfolios(globalThis, GetMyPortfoliosCallBack) {
  try {
    //Runs if the function has been called before program launched
    if (!globalThis.attributes['resumePoint']) {
      GetPortfolioMetricsCallBack("Oh Tas functions cannot be run without opening Oh Tas first.", true)
    }

    //If this is the first command after the program has launched, then set the currentFunc to this function
    if (globalThis.attributes['resumePoint'] === "A0") {
      globalThis.attributes['currentFunc'] = "GetMyPortfolios";
    }

    //Runs if the user calls this function but I was expecting the user to call something else
    if (globalThis.attributes['currentFunc'] != "GetMyPortfolios") {
      GetMyPortfoliosCallBack("You can't call another Oh Tas function if you are already executing one", true)
    }

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
      GetMyPortfoliosCallBack(sPrintString, true);
    }

    request(options, APIcallback);
  } catch (error) { GetMyPortfoliosCallBack("Sorry, there has been an error in getting information for this stock. " + err, true) }
}

//----GetTechnicalStockInfo----
function GetTechnicalStockInfo(globalThis, GetTechnicalStockInfoCallBack) {
  try {
    //Runs if the function has been called before program launched
    if (!globalThis.attributes['resumePoint']) {
      GetTechnicalStockInfoCallBack("Oh Tas functions cannot be run without opening Oh Tas first.", true)
    }

    //If this is the first command after the program has launched, then set the currentFunc to this function
    if (globalThis.attributes['resumePoint'] === "A0") {
      globalThis.attributes['currentFunc'] = "GetTechnicalStockInfo";
    }

    //Runs if the user calls this function but I was expecting the user to call something else
    if (globalThis.attributes['currentFunc'] != "GetTechnicalStockInfo") {
      GetTechnicalStockInfoCallBack("You can't call another Oh Tas function if you are already executing one", true)
    }

    var [OtasID, sPredictedName, dCertainty] = miscFunctions.GetOtasID(globalThis.event.request.intent.slots.StockString.value);
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
      GetTechnicalStockInfoCallBack(sPrintString, true);
    }

    request(options, APIcallback);
  } catch (error) { GetTechnicalStockInfoCallBack("Sorry, there has been an error in getting information for this stock. " + err, true) }
}


//----GetPortfolioMetrics----
function GetPortfolioMetrics(globalThis, GetPortfolioMetricsCallBack) {
  try {
    //Runs if the function has been called before program launched
    if (!globalThis.attributes['resumePoint']) {
      GetPortfolioMetricsCallBack("Oh Tas functions cannot be run without opening Oh Tas first.", true)
    }

    //If this is the first command after the program has launched, then set the currentFunc to this function
    if (globalThis.attributes['resumePoint'] === "A0") {
      globalThis.attributes['currentFunc'] = "GetPortfolioMetrics";
    }

    //Runs if the user calls this function but I was expecting the user to call something else
    if (globalThis.attributes['currentFunc'] != "GetPortfolioMetrics") {
      GetPortfolioMetricsCallBack("You can't call another Oh Tas function if you are already executing one", true)
    }

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
      GetPortfolioMetricsCallBack(sPrintString, true);
    }
  } catch (error) { GetPortfolioMetricsCallBack("Sorry, there has been an error in getting information for this stock. " + err, true) }
}

