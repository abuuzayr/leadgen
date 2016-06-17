var express = require('express'),
apiRouter = express.Router(),
dbHandler = require('../database-handler'),
jsonParser = require('body-parser').json();
ContactsManager = require('../ContactsManager/contacts-manager');

apiRouter.use('/',jsonParser,function(req,res,next){
	console.log('Welcome to the API page');
	next();
})


/*
CRUD on leads list
*/
apiRouter.route('/corporate/contacts/leadList/leads')
	.get(function(req,res){
		ContactsManager.displayLeadCB(res,'localCorporate',null,displayResultsCallback);
	})
	.post(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.addLeadCB(res,'localCorporate',req.body,returnStatusCode);
		}
	})
	.delete(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.deleteLeadsCB(res,'localCorporate',req.body,returnStatusCode);
		}
	})
	.patch(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.updateLeadCB(res,'localCorporate',req.body,returnStatusCode);
		}
	});

/*
CRUD on fields
*/
apiRouter.route('/corporate/contacts/leadList/fields')
	.get(function(req,res){
		ContactsManager.displayLeadCB(res,'localCorporate',null,displayResultsCallback);
	})
	.post(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.addLeadCB(res,'localCorporate',req.body,returnStatusCode);
		}
	})
	.delete(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.deleteLeadsCB(res,'localCorporate',req.body,returnStatusCode);
		}
	})
	.patch(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.updateLeadCB(res,'localCorporate',req.body,returnStatusCode);
		}
	});


var displayResultsCallback = function(res,results){
	res.json(results);
};

var returnStatusCode = function(res,statusCode){
	res.sendStatus(statusCode);
}

module.exports = apiRouter;