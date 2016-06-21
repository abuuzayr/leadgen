var express = require('express'),
apiRouter = express.Router(),
dbHandler = require('../database-handler'),
jsonParser = require('body-parser').json(),
ContactsManager = require('../ContactsManager/contacts-manager'),
ScrapManager = require('../ScrapingManager/scrap-manager'),
fs = require('fs');

apiRouter.use('/',jsonParser,function(req,res,next){
	console.log('Welcome to the API page');
	next();
})


/*
CRUD on leads list
*/
apiRouter.route('/corporate/contacts/leadList/leads')
	.get(function(req,res){
		ContactsManager.displayContacts(res,'localCorporate',null,displayResultsCallback);
	})
	.post(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.addContacts(res,'localCorporate',req.body,returnStatusCode);
		}
	})
	.delete(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.deleteContacts(res,'localCorporate',req.body,returnStatusCode);
		}
	})
	.patch(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.updateContacts(res,'localCorporate',req.body,returnStatusCode);
		}
	});

/*
Add/remove on fields
*/
apiRouter.route('/corporate/contacts/leadList/fields')
	.post(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			if(req.body.fieldName == undefined || req.body.fieldName == null || req.body.fieldName == '')
				returnStatusCode(res,400);
			else{
				var str = req.body.fieldName;	
				ContactsManager.addField(res,'localCorporate',str,returnStatusCode);				
			}

		}
	})
	.delete(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			if(req.body.fieldName == undefined || req.body.fieldName == null || req.body.fieldName == '')
				returnStatusCode(res,400);
			else{
				var str = req.body.fieldName;	
				ContactsManager.removeField(res,'localCorporate',str,returnStatusCode);				
			}

		}
	});



/*
	BlackList API
*/
apiRouter.route('/corporate/contacts/blackList/domain')
	.get(function(req,res){
		fs.readFile('./domains.json',function(err,data){
			if(err != null)
				returnStatusCode(res,500);
			else{
				res.json(JSON.parse(data));
			}
		});
	})
	.post(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			if(req.body.domainName == undefined || req.body.domainName == null || req.body.domainName == '')
				returnStatusCode(res,400);
			else{
				var str = req.body.domainName;
				fs.readFile('./domains.json',function(err,data){
					if(err != null)
						returnStatusCode(res,500);
					else{
						var arr = JSON.parse(data);
						arr.push(str);
						fs.writeFile('./domains.json',JSON.stringify(arr,null,4) , function(err){
							if(err != null )
								returnStatusCode(res,500);
							else
								returnStatusCode(res,200);
						})						
					}
	
				})	
			}
		}
	})
	.delete(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			if(req.body.domainName == undefined || req.body.domainName == null || req.body.domainName == '')
				returnStatusCode(res,400);
			else{
				var str = req.body.domainName;
				fs.readFile('./domains.json',function(err,data){
					if(err != null)
						returnStatusCode(res,500);
					else{
						var arr1 = JSON.parse(data);
						var arr2 = [];
						for(var i=0;i<arr1.length;i++){
							if (arr1[i] != str ) 
								arr2.push(arr1[i]);
						}
						if(arr2.length == arr1.length)
						 	returnStatusCode(res,400);
						fs.writeFile('./domains.json',JSON.stringify(arr2,null,4) , function(err){
							if(err != null )
								returnStatusCode(res,500);
							else
								returnStatusCode(res,200);
						})						
					}
	
				})	
			}
		}
	})

apiRouter.route('/corporate/contacts/blackList/contacts')
	.get(function(req,res){
		ContactsManager.displayContacts(res,'localCorporate',null,displayResultsCallback);
	})
	.post(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.addContacts(res,'localCorporate',req.body,returnStatusCode);
		}
	})
	.delete(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.deleteContacts(res,'localCorporate',req.body,returnStatusCode);
		}
	})
	.patch(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.updateContacts(res,'localCorporate',req.body,returnStatusCode);
		}
	});



/*
API FOR ScrapingManager
*/
apiRouter.route('/corporate/scrape/g/new')
	.get(function(req,res){
		if(!req.body)
			returnStatusCode(res,400)
		else{
			index = 0
			ScrapManager.scrapCorporateGoogleNew(index,'engineering')
			.then(function(results){
				res.json(results);
			})
			.catch(function(error){
				res.sendStatus(400);
			});
		}
	});

apiRouter.get('/corporate/scrape/g/cont',function(req,res){
	if(!req.body)
		returnStatusCode(res,400);
	else{
		index ++;
		ScrapManager.scrapCorporateGoogleNew(index,'engineering')
		.then(function(results){
			res.json(results);
		})
		.catch(function(error){
			res.sendStatus(400);
		});
	}
});


/*
Helper functions
*/
var displayResultsCallback = function(res,results){
	res.json(results);
};

var returnStatusCode = function(res,statusCode){
	res.sendStatus(statusCode);
}

module.exports = apiRouter;