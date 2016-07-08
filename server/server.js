var express = require('express');
var app = express();
var config = require('./config');
var common = require('./common');
var assert = require('assert');
var dbHandler = require('./database-handler');
var apiRouter = require('./routes/api');
var ScrapManager = require('./ScrapingManager/scrap-manager');
var mongodb = require('mongodb');

var url = config.dbURI;



app.use('/', express.static('../client'));

app.use('/api', apiRouter);

dbHandler.dbConnect(function(result) {
  if (result == config.successMsg)
    app.listen(config.port, function() {
      console.log('Starting application server');
    });
  else
    console.log('Could not connect to database');
})