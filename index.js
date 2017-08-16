var request = require('request');
var https = require('https')
const myFunctions = require('./functions');

exports.handler = (event, context) => {
console.log("Started index.js");
  try {

    if (event.session.new) {
      console.log("NEW SESSION")
    }

    switch (event.request.type) {
      case "LaunchRequest":
      console.log(`LAUNCH REQUEST`)
      context.succeed(
        generateResponse(
          buildSpeechletResponse("Welcome to an Alexa Skill", true),
          {}
        )
      )
      break;

      case "IntentRequest":
      console.log(`INTENT REQUEST`)
      switch(event.request.intent.name) {
        case "GetPL":
        context.succeed(
          generateResponse(
            buildSpeechletResponse(`your PL is 4`, true),
            {}
          )
        )
        break;

        case "GetStockInfo":
        var OtasID = myFunctions.GetOtasID(event.request.intent.slots.StockString.value);
        myFunctions.StockInfo(OtasID, function(sPrintString){
          context.succeed(
            generateResponse(
              buildSpeechletResponse(sPrintString, true),
              {}
            )
          )
          console.log(sPrintString + "\n");
        })
        break;

        case "GetTechnicalInfo":
        var OtasID = myFunctions.GetOtasID(event.request.intent.slots.StockString.value);
        myFunctions.TechnicalStockInfo(OtasID, function(sPrintString){
          context.succeed(
            generateResponse(
              buildSpeechletResponse(sPrintString, true),
              {}
            )
          )
          console.log(sPrintString + "\n");
        })
        break;

        case "GetMyPortfolios":
        myFunctions.GetMyPortfolios(function(sPrintString){
          context.succeed(
            generateResponse(
              buildSpeechletResponse(sPrintString, true),
              {}
            )
          )
          console.log(sPrintString + "\n");
        })
        break;

        case "GetPortfolioMetrics":
        myFunctions.GetPortfolioMetrics(event.request.intent.slots.portfolioName.value, function(sPrintString){
          context.succeed(
            generateResponse(
              buildSpeechletResponse(sPrintString, true),
              {}
            )
          )
          console.log(sPrintString + "\n");
        })
        break;

        default:
        throw "Invalid intent"
      }
      break;

      case "SessionEndedRequest":
      console.log(`SESSION ENDED REQUEST`)
      break;

      default:
      context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)
    }

  } catch(error) { context.fail(`Exception: ${error}`) }
}

buildSpeechletResponse = (outputText, shouldEndSession) => {
  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }
}

generateResponse = (speechletResponse, sessionAttributes) => {
  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }
}
