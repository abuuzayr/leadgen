var express = require('express'),
apiRouter = express.Router(),
dbHandler = require('../database-handler'),
jsonParser = require('body-parser').json(),
ContactsManager = require('../ContactsManager/contacts-manager'),
ScrapManager = require('../ScrapingManager/scrap-manager'),
fs = require('fs');

var index = 0;

apiRouter.use('/',function(req,res,next){
	console.log('Welcome to the API page');
	next();
})


/*
CRUD on leads list
*/
apiRouter.route('/contacts/leadList/leads')
	.get(function(req,res){
		ContactsManager.displayContacts(res,'localCorporate',null,displayResultsCallback);
	})
	.post(jsonParser,function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.addContacts(res,'localCorporate',req.body,returnStatusCode);
		}
	})
	.delete(jsonParser,function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.deleteContacts(res,'localCorporate',req.body,returnStatusCode);
		}
	})
	.patch(jsonParser,function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.updateContacts(res,'localCorporate',req.body,returnStatusCode);
		}
	});



/*
Add/remove on fields
*/
apiRouter.route('/contacts/leadList/fields')
	.post(jsonParser,function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			if(req.body.fieldName == undefined || req.body.fieldName == null || req.body.fieldName == '')
				returnStatusCode(res,400);
			else{
				var str = req.body.fieldName;	
				ContactsManager.addField('localCorporate',str)
				// .then(function(results){
				// 	return ContactsManager.addField('localConsumer',str)
				// })
				.then(function(results){
					console.log('hello');
					res.sendStatus(200);
				})
				.catch(function(error){
					console.log('world');
					res.sendStatus(500);
				})				
			}
		}
	})
	.delete(jsonParser,function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			if(req.body.fieldName == undefined || req.body.fieldName == null || req.body.fieldName == '')
				returnStatusCode(res,400);
			else{
				var str = req.body.fieldName;	
				ContactsManager.removeField('localCorporate',str)
				// .then(function(results){
				// 	return ContactsManager.removeField('localConsumer',str)
				// })
				.then(function(results){
					res.sendStatus(200);
				})
				.catch(function(error){
					res.sendStatus(500);
				})				
			}
		}
	});



/*
	BlackList API
*/
apiRouter.route('/contacts/blackList/domain')
	.get(function(req,res){
		fs.readFile('./domains.json',function(err,data){
			if(err != null)
				returnStatusCode(res,500);
			else{
				res.json(JSON.parse(data));
			}
		});
	})
	.post(jsonParser,function(req,res){
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
							else{
								ContactsManager.addDomainChain('localCorporate',str)
								.then(function(results){
									returnStatusCode(res,200);
								})
								.catch(function(error){
									returnStatusCode(res,200);
								});
								// .then(function(results){
								// 	return ContactsManager.addDomainChain('localConsumer',str);
								// })
								// .then(function(results){
								// 	returnStatusCode(res,200);
								// })
								// .catch(function(error){
								// 	returnStatusCode(res,500);
								// })
							}
						})						
					}
	
				})	
			}
		}
	})
	.delete(jsonParser,function(req,res){
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

apiRouter.route('/contacts/blackList')
	.get(function(req,res){
		ContactsManager.displayContacts(res,'blackList',null,displayResultsCallback);
	})
	.delete(jsonParser,function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.deleteContacts(res,'blackList',req.body,returnStatusCode);
		}
	})



/*
Scraping API
*/
apiRouter.get('/corporate/scrape/g/new/:category', function(req,res){
	if(!req.params.category)
		returnStatusCode(res,400)
	else{
		var str = req.params.category;
		index = 0;
		ScrapManager.scrapCorporateGoogleNew(index,str)
		.then(function(results){
			res.json(results);
		})
		.catch(function(error){
			res.sendStatus(400);
		});
	}
})
apiRouter.get('/corporate/scrape/g/cont/:category',function(req,res){
	if(!req.params.category)
		returnStatusCode(res,400)
	else{
		var str = req.params.category;
		index ++;
		ScrapManager.scrapCorporateGoogleNew(index,str)
		.then(function(results){
			res.json(results);
		})
		.catch(function(error){
			res.sendStatus(400);
		});
	}
})

apiRouter.post('/corporate/scrape/',jsonParser,function(req,res){
	if(!req.body)
		returnStatusCode(res,400);
	else{
		if(!Array.isArray(req.body))
			returnStatusCode(res,400);
		else{
			ContactsManager.addScrapeContacts(res,'localCorporate',req.body,returnStatusCode);
		}
	}
})

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