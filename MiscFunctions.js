"use strict";

const StockList = require('./StockList');

module.exports = {
    Similarity: Similarity,
    GetOtasID: GetOtasID,
    GetStockName: GetStockName,
    Pad: Pad
}

var stockList = StockList.StockDatabase;

//----GetOtasID----
function GetOtasID(StockString) {
    var Options = [];
    stockList.forEach(function (element) {

        Options.push(Similarity(Pad('00000000000000000000000000000000000000000000000000', element.Name, false), Pad('11111111111111111111111111111111111111111111111111', StockString, false)));

    }, this);

    var index = Options.indexOf(Math.max(...Options))

    return stockList[index].OtasID
}

//----GetStockName----
function GetStockName(OtasID) {
    var Options = [];
    stockList.forEach(function (element) {
        Options.push(Similarity(Pad('00000000000000000000000000000000000000000000000000', element.OtasID, false), Pad('11111111111111111111111111111111111111111111111111', OtasID, false)));
    }, this);

    var index = Options.indexOf(Math.max(...Options))

    return stockList[index].Name
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
    if (longerLength == 0) {
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
            if (i == 0)
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