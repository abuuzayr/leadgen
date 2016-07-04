var express = require('express');
var app = express();
var config = require('./config');
var common = require('./common');
var assert = require('assert');
var dbHandler = require('./database-handler');
var apiRouter = require('./routes/api');
var ScrapManager = require('./ScrapingManager/scrap-manager');
var columns = require('./defaultColumns.json');
var mongodb = require('mongodb');

var url = config.dbURI;



app.use('/', express.static('../client'));

app.use('/api',apiRouter);

dbHandler.dbConnect(function(result){
  if(result == config.successMsg)
    app.listen(config.port ,function(){
      console.log('Starting application server');
      dbHandler.dbQuery('columnDef', null)
      .then(function(results){
        if(results.length == 0)
          return dbHandler.dbInsert('columnDef',columns)
        else
          return 1;
      })
      .then(function(results){
        console.log('Server running');
      })
      .catch(common.printStuff);
    });
  else
    console.log('Could not connect to database');
})
