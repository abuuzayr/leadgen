var express = require('express'),
app = express(),
config = require('./config'),
assert = require('assert'),
dbHandler = require('./ContactsManager/database-handler');

var url = config.dbURI;
app.listen(3000,function(){
	dbHandler.dbConnect();
	dbHandler.dbInsert('localContacts');
});
