"use strict";

const Alexa = require('alexa-sdk');
const Handlers = require('./Handlers.js');

const handlers = Handlers.Handlers;

exports.handler = function (event, context, callback) {
  var alexa = Alexa.handler(event, context);

  alexa.registerHandlers(handlers);
  alexa.execute();
};

