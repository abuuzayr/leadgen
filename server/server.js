var express = require('express'),
app = express(),
config = require('./config'),
common = require('./common'),
assert = require('assert'),
dbHandler = require('./database-handler'),
apiRouter = require('./routes/api'),
ScrapManager = require('./ScrapingManager/scrap-manager');

var mongodb = require('mongodb');

var url = config.dbURI;



app.use('/', express.static('../client'));

app.use('/api',apiRouter);

dbHandler.dbConnect(function(result){
	if(result == config.successMsg)
		app.listen(config.port ,function(){
			console.log('Starting application server');

		});
	else
		console.log('Could not connect to database');
})


/*
var obj = {
	name : 'test',
	email : "test2@test.com",
	company : 'Test Pte Ltd',
	phoneNumber : '999'
};


var searchObj = {
	_id : new mongodb.ObjectID('5760fc17e4441d670e4d4736')
}

var delObj = {
	_id : new mongodb.ObjectID('57620527d6ba22ca050a5b73')
}

var updateObj = {
	name : 'Lim Qi Wen',
	email : 'qwpwnage@gmail.com',
	company : 'Marvel Studios',
	phoneNumber : '111'
}*/