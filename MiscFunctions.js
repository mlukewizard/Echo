"use strict";

const Lists = require('./Lists');
var request = require('request'); //Used by GetStockDailyFlags
var https = require('https'); //Used by GetStockDailyFlags
var fs = require('fs');

module.exports = {
    Similarity: Similarity,
    GetOtasID: GetOtasID,
    GetOtasIDFromTicker: GetOtasIDFromTicker,
    GetStockName: GetStockName,
    Pad: Pad,
    Log: Log,
    InterRobustGetOtasID: InterRobustGetOtasID,
    InterLaunchChecks: InterLaunchChecks,
    interGenericCallBack: interGenericCallBack,
    StockDailyFlagsFromAPI: StockDailyFlagsFromAPI,
    GetPortfolioEntry: GetPortfolioEntry,
    StockNaturalLanguageFromAPI: StockNaturalLanguageFromAPI,
}

var stockList = Lists.StockDatabase;
var naturalLanguageTopics = Lists.naturalLanguageTopics;
var dailyFlagTopics = Lists.dailyFlagTopics;

//----interGenericCallBack----
function interGenericCallBack(sPrintString, globalThis, bTerminate) {
    if (bTerminate) {
        globalThis.emit(':tell', sPrintString);
        console.log(sPrintString + "\n");
    } else {
        globalThis.emit(':ask', sPrintString);
        console.log(sPrintString + "\n");
    }
}

//----interLaunchChecks----
function InterLaunchChecks(globalThis, CallBackFunc, callingFuncName) {
    //Runs if the function has been called before program launched
    if (!globalThis.attributes['resumePoint']) {
        (globalThis.attributes['resumePoint'] = "A0")
    }

    //If this is the first command after the program has launched, then set the currentFunc to this function
    if (globalThis.attributes['resumePoint'] === "A0") {
        globalThis.attributes.runningFunc = {}
        globalThis.attributes['currentFunc'] = callingFuncName;
    }

    //Runs if the user calls this function but I was expecting the user to call something else
    if (globalThis.attributes['currentFunc'] != callingFuncName) {
        CallBackFunc("You can't call another Oh Tas function if you are already executing one", globalThis, true)
    }
}

//----InterRobustGetOtasID----
function InterRobustGetOtasID(globalThis, CallBackFunc, callingFuncName) {
    //------------------
    //Resume point after calling this function is A3
    //------------------

    //Sets the stock string in the storage object to the users slot value
    if (globalThis.attributes['resumePoint'] === "A0") { globalThis.attributes.runningFunc['userStockString'] = globalThis.event.request.intent.slots.StockString.value }

    //Simply shortening the variable name to make the rest of the code more readable
    var runningFuncCache = globalThis.attributes.runningFunc;

    //Gets OTAS ID given the parameter which is currently stored in the data cache, runs on every iteration
    var [OtasID, sPredictedName, dCertainty] = GetOtasID(runningFuncCache['userStockString']);
    runningFuncCache['OtasID'] = OtasID

    //Sees if it's the first run and if it is, checks if it's likely that you've managed to get the OtasID right
    if (globalThis.attributes['resumePoint'] === "A0" && dCertainty < 0.6) {
        globalThis.attributes['resumePoint'] = "A1";
        CallBackFunc("I'm not sure I understood that stock name correctly, did you mean " + sPredictedName + "?", globalThis, false)
    }

    //Runs only if this is the second run through, sees if the user has accepted the correction or not
    if (globalThis.attributes['resumePoint'] === "A1") {
        if (globalThis.attributes['YesVsNo'] === "UserSaysNo") { //Executes if the stock estimation is wrong
            runningFuncCache['OtasID'] = "Null";
            globalThis.attributes.runningFunc['userStockString'] = "Null";
            globalThis.attributes['YesVsNo'] = "Null" //Resetting to "Null" to avoid bugs
            globalThis.attributes['resumePoint'] = "A2";
            CallBackFunc("I can also find a stock by ticker symbol, do you know it?", globalThis, false) //offers to specify by stock symbol
        } else if (globalThis.attributes['YesVsNo'] === "UserSaysYes") { //Executes if the stock estimation is correct
            globalThis.attributes['YesVsNo'] = "Null" //Resetting YesVsNo to avoid bugs
        }
    }

    //Runs only if this is the third run through, checks the ticker symbol which the user has given and sees if it matches any in the stock list
    if (globalThis.attributes['resumePoint'] === "A2") {
        if (globalThis.attributes['Ticker']) {
            [OtasID, sPredictedName, dCertainty] = GetOtasIDFromTicker(globalThis.attributes['Ticker'])
            if (OtasID === null) {
                CallBackFunc("I couldn't find that ticker symbol", globalThis, true) //terminates the dialogue because the ticker symbol didnt match
            }
            else {
                runningFuncCache['OtasID'] = OtasID
            }
        }
        else if (globalThis.attributes['YesVsNo'] === "UserSaysNo") {
            globalThis.attributes['YesVsNo'] = "Null" //Resetting YesVsNo to avoid bugs
            CallBackFunc("Ok", globalThis, true)
        }
        else if (globalThis.attributes['YesVsNo'] === "UserSaysYes") {
            globalThis.attributes['YesVsNo'] = "Null" //Resetting YesVsNo to avoid bugs
            CallBackFunc("Cool! In future you can just say it.", globalThis, false)
        }
    }
    return OtasID
}

//----GetPortfolioEntry----
function GetPortfolioEntry(secListName, GetPortfolioEntryCallBack) {
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
            //Options.push(Similarity(Pad('00000000000000000000000000000000000000000000000000', element.securityListName, false), Pad('11111111111111111111111111111111111111111111111111', secListName, false)));
            Options.push(Similarity(element.securityListName, secListName));
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

        //This is the second call which takes the confirmed portfolio name and produces the risk analytics and Alexa's output
        request(options2, APIcallback2)
    }

    //This is the first call which gets the list of available portfolios to compare the user defined string against
    request(options, APIcallback);

    function APIcallback2(error, response, body) {
        var info2 = JSON.parse(body);
        GetPortfolioEntryCallBack(info2)
    }
}

//----StockNaturalLanguageFromAPI----
function StockNaturalLanguageFromAPI(OtasID, StockNaturalLanguageFromAPICallBack) {

    var options = {
        "rejectUnauthorized": false,
        url: 'https://apps-dev.otastech.com/v1.11.2/api/stock/' + OtasID + '/text ',
        headers: {
            'Authorization': 'ADE2C684A57BA4AB25542F57B5E5B'
        }
    };

    function APIcallback(error, response, body) {
        var info = JSON.parse(body);
            StockNaturalLanguageFromAPICallBack(info.naturalLanguage)
    }

    request(options, APIcallback);
}

//----StockDailyFlagsFromAPI----
function StockDailyFlagsFromAPI(OtasID, StockDailyFlagsFromAPICallBack) {

    var options = {
        "rejectUnauthorized": false,
        url: 'https://api-dev.otastech.com/v1.11.1/stock/' + OtasID + '/dailyflags',
        headers: {
            'Authorization': 'ADE2C684A57BA4AB25542F57B5E5B',
            'Username': 'luke.markham@otastechnology.com',
            'Password': 'Otastech1!'
        }
    };

    function APIcallback(error, response, body) {
        var info = JSON.parse(body);
            StockDailyFlagsFromAPICallBack(info.dailyFlags)
    }

    request(options, APIcallback);
}

//----GetOtasID----
function GetOtasID(StockString) {
    var Options = [];
    stockList.forEach(function (element) {

        Options.push(Similarity(element.Name, StockString));

    }, this);

    var index = Options.indexOf(Math.max(...Options));

    return [stockList[index].OtasID, stockList[index].Name, Math.max(...Options)]
}

//----GetOtasIDFromTicker----
function GetOtasIDFromTicker(sTicker) {
    var Options = [];
    stockList.forEach(function (element) {

        Options.push(Similarity(element.BBTicker, sTicker));

    }, this);

    if (Math.max(...Options) != 1) {
        return [null, null, null] //If youre not getting a perfect match on BBTicker then its not good enough tbh
    } else {
        var index = Options.indexOf(Math.max(...Options));
        return [stockList[index].OtasID, stockList[index].Name, Math.max(...Options)]
    }
}

//----GetStockName----
function GetStockName(OtasID) {
    var Options = [];
    stockList.forEach(function (element) {
        Options.push(Similarity(element.OtasID, OtasID));
    }, this);

    if (Math.max(...Options) != 1) {
        return [null, null] //If youre not getting a perfect match on OTAS ID then its not good enough tbh
    } else {
        var index = Options.indexOf(Math.max(...Options));
        return [stockList[index].Name, Math.max(...Options)]
    }
}

//----Similarity----
function Similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

//---editDistance(for similarity)----
function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i === 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

//----Pad----
function Pad(pad, str, padLeft) {
    if (typeof str === 'undefined')
        return pad;
    if (padLeft) {
        return (pad + str).slice(-pad.length);
    } else {
        return (str + pad).substring(0, pad.length);
    }
}

//----Program logging----
function Log(text){
fs.appendFileSync('./ProgramLog.txt', text + "\r\n");
}
