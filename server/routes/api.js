var express = require('express');
var apiRouter = express.Router();
var dbHandler = require('../database-handler');
var jsonParser = require('body-parser').json();
var ContactsManager = require('../ContactsManager/contacts-manager');
var ScrapManager = require('../ScrapingManager/scrap-manager');
var mongodb = require('mongodb');
var fs = require('fs');

var index = 0;

apiRouter.use('/',function(req,res,next){
	console.log('Welcome to the API page');
	next();
});

/*
CRUD on leads list
*/
apiRouter.route('/contacts/leadList/leads')
	.get(function(req,res){
		ContactsManager.displayLeads(null)
		.then(function(results){
			res.json(results);
		})
		.catch(function(error){
			res.sendStatus(error);
		})
	})
	.post(jsonParser,function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.addContacts(req.body)
			.then(function(results){
				res.sendStatus(results);
			})
			.catch(function(error){
				res.sendStatus(error);
			})
		}
	})
	.delete(jsonParser,function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.deleteLeads(req.body)
			.then(function(results){
				res.sendStatus(results);
			})
			.catch(function(error){	
				res.sendStatus(error);
			})
		}
	})
	.patch(jsonParser,function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.updateContacts(req.body)
			.then(function(results){
				res.sendStatus(results);
			})
			.catch(function(error){
				res.sendStatus(error);
			})
		}
	});

apiRouter.delete('/contacts/leadList/leads/duplicate',jsonParser,function(req,res){
	if(!req.body)
		returnStatusCode(res,400);
	else{
		dbHandler.dbRemoveDuplicate('leadList',req.body.fieldName)
		.then(function(results){
			res.sendStatus(200);
		})
		.catch(function(error){
			res.sendStatus(500	);
		})
	}
})

apiRouter.get('/contacts/leadList/leads/:id',function(req,res){
	//TODO return history of lead
	if(!req.params.id)
		res.sendStatus(400);
	else{
		var obj = {}
		obj._id = new mongodb.ObjectID(req.params.id);
		dbHandler.dbQuery('leadList',obj)
		.then(function(results){
			res.json(results);
		})
		.catch(function(error){
			res.sendStatus(error);
		})
	}
})
apiRouter.post('/contacts/leadList/import',jsonParser,function(req,res){
	if(!req.body)
		returnStatusCode(res,400);
	else{
		if(!Array.isArray(req.body))
			returnStatusCode(res,400);
		else{
			ContactsManager.addBulkContacts(res,req.body,returnStatusCode);
		}
	}
});

/*
*API for ui grid fields
*/
apiRouter.route('/contacts/leadList/fields')
	.get(function(req,res){
		ContactsManager.displayList('columnDef',null)
		.then(function(results){
			res.json(results);
		})
		.catch(function(error){
			res.sendStatus(error);
		});
	})
	.post(jsonParser,function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			if(req.body.field == undefined || req.body.field == null || req.body.field== '')
				returnStatusCode(res,400);
			else{
				var str = req.body.field;	
				ContactsManager.addField('leadList',str)
				.then(function(results){
					return ContactsManager.insertColumnDef(req.body);
				})
				.then(function(results){
					res.sendStatus(200);
				})
				.catch(function(error){
					res.sendStatus(500);
				})				
			}
		}
	})
	.delete(jsonParser,function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			if(req.body.field == undefined || req.body.field == null || req.body.field == '')
				returnStatusCode(res,400);
			else{
				var str = req.body.field;	
				ContactsManager.removeField('leadList',str)
				.then(function(results){
					return ContactsManager.deleteColumnDef(req.body);
				})
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
		dbHandler.dbQuery('blackListDomains',null)
		.then(function(results){
			res.json(results);
		})
		.catch(function(error){
			res.sendStatus(error);
		})
	})
	.post(jsonParser,function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			if(req.body.domainName == undefined || req.body.domainName == null || req.body.domainName == '')
				returnStatusCode(res,400);
			else{
				ContactsManager.addDomain(req.body)
				.then(function(results){
					return ContactsManager.addDomainChain('leadList',req.body.domainName)
				})
				.then(function(results){
					res.sendStatus(results);
				})
				.catch(function(error){
					res.sendStatus(error);
				});

				// fs.readFile('./domains.json',function(err,data){
				// 	if(err != null)
				// 		returnStatusCode(res,500);
				// 	else{
				// 		var arr = JSON.parse(data);
				// 		arr.push(str);
				// 		fs.writeFile('./domains.json',JSON.stringify(arr,null,4) , function(err){
				// 			if(err != null )
				// 				returnStatusCode(res,500);
				// 			else{
				// 				ContactsManager.addDomainChain('leadList',str)
				// 				.then(function(results){
				// 					returnStatusCode(res,200);
				// 				})
				// 				.catch(function(error){
				// 					returnStatusCode(res,200);
				// 				});
				// 			}
				// 		})						
				// 	}
	
				// })	
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
				ContactsManager.deleteDomain(req.body)
				.then(function(results){
					res.sendStatus(results);
				})
				.catch(function(error){
					res.sendStatus(error);
				})
				/*fs.readFile('./domains.json',function(err,data){
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
	
				})*/	
			}
		}
	})

apiRouter.route('/contacts/blackList')
	.get(function(req,res){
		ContactsManager.displayList('blackList',null)
		.then(function(results){
			res.json(results);
		})
		.catch(function(error){
			res.sendStatus(error);
		});
	})
	.delete(jsonParser,function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.deleteFromBlackList(req.body)
			.then(function(results){
				res.sendStatus(results);
			})
			.catch(function(error){
				res.sendStatus(error);
			})
		}
	})

/*
Scraping API
*/
apiRouter.get('/corporate/scrape/g/new/:category/:country', function(req,res){
	if(!req.params.category || !req.params.country)
		returnStatusCode(res,400);
	else{
		var type = req.params.category;
		var country = req.params.country.replace('+' , ' ');
		index = 0;
		ScrapManager.scrapCorporateGoogleNew(type,country)
		.then(function(results){
			res.json(results);
		})
		.catch(function(error){
			res.sendStatus(400);
		});
	}
})
apiRouter.get('/corporate/scrape/g/cont/:category/:country',function(req,res){
	if(!req.params.category || !req.params.country)
		returnStatusCode(res,400);
	else{
		var type = req.params.category;
		var country = req.params.country.replace('+', ' ');
		index ++;
		ScrapManager.scrapCorporateGoogleCont(index,type,country)
		.then(function(results){
			res.json(results);
		})
		.catch(function(error){
			res.sendStatus(400);
		});
	}
})
apiRouter.get('/corporate/scrape/yp/:category',function(req,res){
	if(!req.params.category)
		returnStatusCode(res,400);
	else{
		var type = req.params.category;
		ScrapManager.scrapCorporateYellowPage(type)
		.then(function(results){
			res.json(results);
		})
		.catch(function(error){
			res.sendStatus(400);
		});
	}
})
apiRouter.get('/consumer/scrape/yp/:category',function(req,res){
	if(!req.params.category)
		returnStatusCode(res,400);
	else{
		var type = req.params.category;
		ScrapManager.scrapConsumerYellowPage(type)
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
			ContactsManager.addBulkContacts(res,req.body,returnStatusCode);
		}
	}
})


apiRouter.post('/test',jsonParser,function(req,res){
	if(!req.body)
		returnStatusCode(res,400);
	else{
		dbHandler.dbInsertReturnID('leadList',req.body)
		.then(function(results){
			res.json(results);
		})
		.catch(function(error){
			res.sendStatus(error);
		})
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