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
			// dbHandler.dbQuery('localConsumer', null)
			// .then(common.printStuff)
			// .catch(common.printStuff);
		});
	else
		console.log('Could not connect to database');
})
