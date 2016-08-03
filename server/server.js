var express = require('express');
var app = express();
var config = require('./config');
var common = require('./common');
var assert = require('assert');
var dbHandler = require('./database-handler');
var apiRouter = require('./routes/api');
var ScrapManager = require('./ScrapingManager/scrap-manager');
var MongoClient = require('mongodb').MongoClient;
var databaseManager = require('./DatabaseManager/database-manager');

var url = config.dbURI;



app.use('/', express.static('../client'));

app.use('/api', apiRouter);

MongoClient.connect(config.dbURI)
	.then(function (db1){
		MongoClient.connect(config.dbURI_sa)
		.then(function(db2){
			module.exports = {
				db1: db1,
				db2: db2
			};

			app.listen(config.port,function(){
				console.log('Express server listening on port '+ config.port);
			});
		})
		.catch(function(err){
			console.log(err);
		});
	})
	.catch(function(err){
		console.log(err);
	});
