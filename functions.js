var request = require('request');
var https = require('https')

exports.StockInfo = function(OtasID, callbackfunc1){
  var options = {
    "rejectUnauthorized": false,
    url: 'https://api-dev.otastech.com/v1.11.1/stock/' + OtasID +  '/',
    headers: {
      'Authorization':'ADE2C684A57BA4AB25542F57B5E5B'
    }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      callbackfunc1(info.description);
    }
  }

  request(options, callback);
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

exports.GetOtasID = function(StockString){

Options = [];
Object.forEach(function(element) {
      Options.push(similarity(pad('00000000000000000000000000000000000000000000000000',element.Name,false), StockString));
}, this);

index = Options.indexOf(Math.max(...Options))

return Object[index].OtasID
}

 var Object = [
{Name:"Anglo American", BBTicker: "AAL", OtasID: "OT.AAL.S"},
{Name:"Associated British Foods", BBTicker: "ABF", OtasID: "OT.ABF.S"},
{Name:"Admiral Group", BBTicker: "ADM", OtasID: "OT.ADM.S"},
{Name:"Ashtead Group", BBTicker: "AHT", OtasID: "OT.AHT.S"},
{Name:"Antofagasta", BBTicker: "ANTO", OtasID: "OT.ANTO.S"},
{Name:"Aviva", BBTicker: "AV", OtasID: "OT.AV.S"},
{Name:"AstraZeneca", BBTicker: "AZN", OtasID: "OT.AZN.S"},
{Name:"BAE Systems", BBTicker: "BA", OtasID: "OT.BA.S"},
{Name:"Babcock International Group", BBTicker: "BAB", OtasID: "OT.BAB.S"},
{Name:"Barclays", BBTicker: "BARC", OtasID: "OT.BARC.S"},
{Name:"British American Tobacco", BBTicker: "BATS", OtasID: "OT.BATS.S"},
{Name:"Barratt Developments", BBTicker: "BDEV", OtasID: "OT.BDEV.S"},
{Name:"British Land Co", BBTicker: "BLND", OtasID: "OT.BLND.S"},
{Name:"BHP Billiton", BBTicker: "BLT", OtasID: "OT.BLT.S"},
{Name:"Bunzl", BBTicker: "BNZL", OtasID: "OT.BNZL.S"},
{Name:"BP", BBTicker: "BP", OtasID: "OT.BP.S"},
{Name:"Burberry Group", BBTicker: "BRBY", OtasID: "OT.BRBY.S"},
{Name:"BT Group", BBTicker: "BTA", OtasID: "OT.BTA.S"},
{Name:"Coca-Cola HBC", BBTicker: "CCH", OtasID: "OT.CCH.S"},
{Name:"Carnival", BBTicker: "CCL", OtasID: "OT.CCL.S"},
{Name:"Centrica", BBTicker: "CNA", OtasID: "OT.CNA.S"},
{Name:"Compass Group", BBTicker: "CPG", OtasID: "OT.CPG.S"},
{Name:"Croda International", BBTicker: "CRDA", OtasID: "OT.CRDA.S"},
{Name:"CRH", BBTicker: "CRH", OtasID: "OT.CRH.S"},
{Name:"ConvaTec Group", BBTicker: "CTEC", OtasID: "OT.CTEC.S"},
{Name:"DCC", BBTicker: "DCC", OtasID: "OT.DCC.S"},
{Name:"Diageo", BBTicker: "DGE", OtasID: "OT.DGE.S"},
{Name:"Direct Line Insurance Group", BBTicker: "DLG", OtasID: "OT.DLG.S"},
{Name:"Experian", BBTicker: "EXPN", OtasID: "OT.EXPN.S"},
{Name:"easyJet", BBTicker: "EZJ", OtasID: "OT.EZJ.S"},
{Name:"Ferguson Ord 10 5366p", BBTicker: "FERG", OtasID: "OT.FERG.S"},
{Name:"Fresnillo", BBTicker: "FRES", OtasID: "OT.FRES.S"},
{Name:"G4S", BBTicker: "GFS", OtasID: "OT.GFS.S"},
{Name:"GKN", BBTicker: "GKN", OtasID: "OT.GKN.S"},
{Name:"Glencore", BBTicker: "GLEN", OtasID: "OT.GLEN.S"},
{Name:"GlaxoSmithKline", BBTicker: "GSK", OtasID: "OT.GSK.S"},
{Name:"Hargreaves Lansdown", BBTicker: "HL", OtasID: "OT.HL.S"},
{Name:"Hammerson", BBTicker: "HMSO", OtasID: "OT.HMSO.S"},
{Name:"HSBC Holdings", BBTicker: "HSBA", OtasID: "OT.HSBA.S"},
{Name:"International Consolidated Airlines Group", BBTicker: "IAG", OtasID: "OT.IAG.S"},
{Name:"InterContinental Hotels Group", BBTicker: "IHG", OtasID: "OT.IHG.S"},
{Name:"3i Group", BBTicker: "III", OtasID: "OT.III.S"},
{Name:"Imperial Brands", BBTicker: "IMB", OtasID: "OT.IMB.S"},
{Name:"Informa", BBTicker: "INF", OtasID: "OT.INF.S"},
{Name:"Intertek Group", BBTicker: "ITRK", OtasID: "OT.ITRK.S"},
{Name:"ITV", BBTicker: "ITV", OtasID: "OT.ITV.S"},
{Name:"Johnson Matthey", BBTicker: "JMAT", OtasID: "OT.JMAT.S"},
{Name:"Kingfisher", BBTicker: "KGF", OtasID: "OT.KGF.S"},
{Name:"Land Securities Group", BBTicker: "LAND", OtasID: "OT.LAND.S"},
{Name:"Legal & General Group", BBTicker: "LGEN", OtasID: "OT.LGEN.S"},
{Name:"Lloyds Banking Group ORD", BBTicker: "LLOY", OtasID: "OT.LLOY.S"},
{Name:"London Stock Exchange Group", BBTicker: "LSE", OtasID: "OT.LSE.S"},
{Name:"Micro Focus International", BBTicker: "MCRO", OtasID: "OT.MCRO.S"},
{Name:"Mediclinic International", BBTicker: "MDC", OtasID: "OT.MDC.S"},
{Name:"Merlin Entertainments", BBTicker: "MERL", OtasID: "OT.MERL.S"},
{Name:"Marks & Spencer Group", BBTicker: "MKS", OtasID: "OT.MKS.S"},
{Name:"Mondi", BBTicker: "MNDI", OtasID: "OT.MNDI.S"},
{Name:"Morrison (Wm) Supermarkets", BBTicker: "MRW", OtasID: "OT.MRW.S"},
{Name:"National Grid", BBTicker: "NG", OtasID: "OT.NG.S"},
{Name:"Next", BBTicker: "NXT", OtasID: "OT.NXT.S"},
{Name:"Old Mutual Group", BBTicker: "OML", OtasID: "OT.OML.S"},
{Name:"Provident Financial", BBTicker: "PFG", OtasID: "OT.PFG.S"},
{Name:"Paddy Power Betfair", BBTicker: "PPB", OtasID: "OT.PPB.S"},
{Name:"Prudential", BBTicker: "PRU", OtasID: "OT.PRU.S"},
{Name:"Persimmon", BBTicker: "PSN", OtasID: "OT.PSN.S"},
{Name:"Pearson", BBTicker: "PSON", OtasID: "OT.PSON.S"},
{Name:"Reckitt Benckiser Group", BBTicker: "RB", OtasID: "OT.RB.S"},
{Name:"Royal Bank of Scotland Group (The)", BBTicker: "RBS", OtasID: "OT.RBS.S"},
{Name:"Royal Dutch Shell", BBTicker: "RDSA", OtasID: "OT.RDSA.S"},
{Name:"Royal Dutch Shell", BBTicker: "RDSB", OtasID: "OT.RDSB.S"},
{Name:"RELX", BBTicker: "REL", OtasID: "OT.REL.S"},
{Name:"Rio Tinto", BBTicker: "RIO", OtasID: "OT.RIO.S"},
{Name:"Royal Mail", BBTicker: "RMG", OtasID: "OT.RMG.S"},
{Name:"Rolls-Royce Group", BBTicker: "RR", OtasID: "OT.RR.S"},
{Name:"Randgold Resources", BBTicker: "RRS", OtasID: "OT.RRS.S"},
{Name:"RSA Insurance Group", BBTicker: "RSA", OtasID: "OT.RSA.S"},
{Name:"Rentokil Initial", BBTicker: "RTO", OtasID: "OT.RTO.S"},
{Name:"Sainsbury (J)", BBTicker: "SBRY", OtasID: "OT.SBRY.S"},
{Name:"Schroders", BBTicker: "SDR", OtasID: "OT.SDR.S"},
{Name:"Sage Group (The)", BBTicker: "SGE", OtasID: "OT.SGE.S"},
{Name:"Segro", BBTicker: "SGRO", OtasID: "OT.SGRO.S"},
{Name:"Shire", BBTicker: "SHP", OtasID: "OT.SHP.S"},
{Name:"Smurfit Kappa Group", BBTicker: "SKG", OtasID: "OT.SKG.S"},
{Name:"Sky", BBTicker: "SKY", OtasID: "OT.SKY.S"},
{Name:"Standard Life", BBTicker: "SL", OtasID: "OT.SL.S"},
{Name:"Smiths Group", BBTicker: "SMIN", OtasID: "OT.SMIN.S"},
{Name:"Scottish Mortgage Investment Trust", BBTicker: "SMT", OtasID: "OT.SMT.S"},
{Name:"Smith & Nephew", BBTicker: "SN", OtasID: "OT.SN.S"},
{Name:"SSE", BBTicker: "SSE", OtasID: "OT.SSE.S"},
{Name:"Standard Chartered", BBTicker: "STAN", OtasID: "OT.STAN.S"},
{Name:"St James's Place", BBTicker: "STJ", OtasID: "OT.STJ.S"},
{Name:"Severn Trent", BBTicker: "SVT", OtasID: "OT.SVT.S"},
{Name:"Tesco", BBTicker: "TSCO", OtasID: "OT.TSCO.S"},
{Name:"TUI AG", BBTicker: "TUI", OtasID: "OT.TUI.S"},
{Name:"Taylor Wimpey", BBTicker: "TW", OtasID: "OT.TW.S"},
{Name:"Unilever", BBTicker: "ULVR", OtasID: "OT.ULVR.S"},
{Name:"United Utilities Group", BBTicker: "UU", OtasID: "OT.UU.S"},
{Name:"Vodafone Group", BBTicker: "VOD", OtasID: "OT.VOD.S"},
{Name:"Worldpay Group", BBTicker: "WPG", OtasID: "OT.WPG.S"},
{Name:"WPP Group", BBTicker: "WPP", OtasID: "OT.WPP.S"},
{Name:"Whitbread", BBTicker: "WTB", OtasID: "OT.WTB.S"}
];
