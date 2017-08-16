var request = require('request');
var https = require('https');
const StockList = require('./StockList');
var Object = StockList.StockDatabase;

//----StockInfo----
exports.StockInfo = function (OtasID, StockInfoCallBack) {
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
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      StockInfoCallBack(info.description);
    }
  }

  request(options, APIcallback);
}

//----GetMyPortfolios----
exports.GetMyPortfolios = function (mainCallBack) {
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
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      sPrintString = "The portfolios you have available are as follows. ";
      for (var i = 0; i < info.length; i++) {
        sPrintString = sPrintString + info[i].securityListName + ", ";
      }
      mainCallBack(sPrintString);
    }
  }

  request(options, APIcallback);
}

//----TechnicalStockInfo----
exports.TechnicalStockInfo = function (OtasID, StockInfoCallBack) {
  var options = {
    "rejectUnauthorized": false,
    url: 'https://apps-dev.otastech.com/v1.11.2/api/stock/' + OtasID + '/text ',
    headers: {
      'Authorization': 'ADE2C684A57BA4AB25542F57B5E5B'
    }
  };

  function APIcallback(error, response, body) {
    sPrintString = "";
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      for (var property in info.naturalLanguage) {
        sPrintString = sPrintString + " With respect to " + info.naturalLanguage[property].topic + ", " + info.naturalLanguage[property].text;
      }
      StockInfoCallBack(sPrintString);
    }
  }

  request(options, APIcallback);
}


//----GetPortfolioMetrics----
exports.GetPortfolioMetrics = function (secListName, mainCallBack) {
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
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);

      Options = [];
      info.forEach(function (element) {
        Options.push(similarity(pad('00000000000000000000000000000000000000000000000000', element.securityListName, false), pad('11111111111111111111111111111111111111111111111111', secListName, false)));
      }, this);

      index = Options.indexOf(Math.max(...Options))

      var options2 = {
        "rejectUnauthorized": false,
        url: 'https://api-dev.otastech.com/v1.11.1/list/portfolio/get/' + info[index].securityListId,
        headers: {
          'Authorization': 'ADE2C684A57BA4AB25542F57B5E5B',
          'Username': 'luke.markham@otastechnology.com',
          'Password': 'Otastech1!'
        }
      };
      request(options2, APIcallback2);
    }
  }

  request(options, APIcallback);

  function APIcallback2(error, response, body) {
    sPrintString = "";
    if (!error && response.statusCode == 200) {
      var info2 = JSON.parse(body);
      sPrintString = "";
      sPrintString = sPrintString + "Your portfolio has a total volatility of " + (3 * Math.random()).toFixed(2).toString() + ". ";
      sPrintString = sPrintString + info2.securityListItems[Math.round(Math.random() * (info2.securityListItems).length)].otasSecurityId + " has the highest marginal contribution to total risk in your portfolio at " + (Math.round(Math.random() * 10) + 5).toString() + " percent.";
      mainCallBack(sPrintString);
    }
  }
}

//----GetOtasID----
exports.GetOtasID = function (StockString) {
  Options = [];
  Object.forEach(function (element) {

    Options.push(similarity(pad('00000000000000000000000000000000000000000000000000', element.Name, false), pad('11111111111111111111111111111111111111111111111111', StockString, false)));

  }, this);

  index = Options.indexOf(Math.max(...Options))

  return Object[index].OtasID
}

//----GetStockName----
exports.GetStockName = function (OtasID) {
  Options = [];
  Object.forEach(function (element) {
    Options.push(similarity(pad('00000000000000000000000000000000000000000000000000', element.OtasID, false), pad('11111111111111111111111111111111111111111111111111', OtasID, false)));
  }, this);

  index = Options.indexOf(Math.max(...Options))

  return Object[index].Name
}


function similarity(s1, s2) {
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

function pad(pad, str, padLeft) {
  if (typeof str === 'undefined')
    return pad;
  if (padLeft) {
    return (pad + str).slice(-pad.length);
  } else {
    return (str + pad).substring(0, pad.length);
  }
}