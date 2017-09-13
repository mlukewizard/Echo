"use strict";

const Alexa = require('alexa-sdk');
const Handlers = require('./Handlers.js');

const handlers = Handlers.Handlers;

exports.handler = function (event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.APP_ID = "amzn1.ask.skill.5000dfa7-e3f1-4d4b-8084-f038baad47d2";
  alexa.registerHandlers(handlers);
  alexa.execute();
};

