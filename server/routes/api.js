var express = require('express'),
apiRouter = express.Router(),
dbHandler = require('../database-handler'),
jsonParser = require('body-parser').json();
ContactsManager = require('../ContactsManager/contacts-manager');

apiRouter.use('/',jsonParser,function(req,res,next){
	console.log('Welcome to the API page');
	next();
})

apiRouter.route('/contacts/leadList/leads')
	.get(function(req,res){
		ContactsManager.displayLeadCB(res,'localContacts',null,displayResultsCallback);
	})
	.post(function(req,res){
		console.log(req.body);
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.addLeadCB(res,'localContacts',req.body,returnStatusCode);
		}
	})
	.delete(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.deleteLeadCB(res,'localContacts',req.body,returnStatusCode);
		}
	})
	.patch(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			
		}
	});



var displayResultsCallback = function(res,results){
	res.json(results);
};

var returnStatusCode = function(res,statusCode){
	res.sendStatus(statusCode);
}

module.exports = apiRouter;