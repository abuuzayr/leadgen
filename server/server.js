var express = require('express'),
app = express(),
config = require('./config'),
common = require('./common'),
assert = require('assert'),
dbHandler = require('./database-handler'),
apiRouter = require('./routes/api');

var mongodb = require('mongodb');

var url = config.dbURI;




// app.listen(3000,function(){
// 	// dbHandler.dbConnect()
// 	// .then(common.printMsg)
// 	// .catch(common.printMsg);

// 	// dbHandler.dbQuery('localContacts', searchObj)
// 	// .then(common.printMsg)
// 	// .catch(common.printMsg);

// 	// dbHandler.dbConnect(common.printMsg);

// 	// dbHandler.dbDelete('localContacts',delObj)
// 	// .then(common.printStuff)
// 	// .catch(common.printStuff);

// 	// dbHandler.dbUpdate('localContacts',searchObj,updateObj)
// 	// .then(common.printStuff)
// 	// .catch(common.printStuff);
	
// 	// dbHandler.dbRemoveDuplicate('localContacts' , 2)
// 	// .then(function(msg){
// 	// 	return dbHandler.dbQuery('localContacts',null);
// 	// })
// 	// .then(common.printStuff)
// 	// .catch(common.printStuff);


// 	// dbHandler.dbInsert('localContacts',obj)
// 	// .then(common.printMsg)
// 	// .catch(common.printMsg);

// 	// dbHandler.dbQuery('localContacts',null)
// 	// .then(common.printStuff)
// 	// .catch(common.printStuff);


// 	console.log('Starting the server');
// });




app.use('/', express.static('../client'));

app.use('/api',apiRouter);

dbHandler.dbConnect(function(result){
	if(result == config.successMsg)
		app.listen(config.port ,function(){
			console.log('Starting application server');
		});
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