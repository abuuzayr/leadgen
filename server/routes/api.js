var express = require('express'),
apiRouter = express.Router(),
dbHandler = require('../database-handler'),
jsonParser = require('body-parser').json(),
ContactsManager = require('../ContactsManager/contacts-manager'),
ScrapManager = require('../ScrapingManager/scrap-manager'),
mongodb = require('mongodb'),
md5 = require('blueimp-md5'),
MailinglistManager = require('../MailinglistManager/mailinglist-manager'),
MailchimpManager= require('../MailchimpManager/syncContacts');

apiRouter.use('/',jsonParser,function(req,res,next){
	console.log('Welcome to the API page');
	next();
})
var apiKey = 'a21a2e3e5898ad6e1d50046f8c33b8ff-us13';

/*
CRUD on leads
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
	.post(function(req,res){
		if(!req.body)
      		res.sendStatus(400);
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
	.delete(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			/*
					{
                        "deleteFromC":["111","222","333"]
					}
			*/
			var promiseArr = [];
			for(var i=0;i<req.body.deleteFromC.length;i++)
			{
				promiseArr.push(deleteContact(req.body.deleteFromC[i]));
				console.log(req.body.deleteFromC[i]);
			}
			Promise.all(promiseArr)
			.then(function(results){
				returnStatusCode(res,200);
			})
			.catch(function(error)
			{
				console.log(error);
			})
		}
	})
	.patch(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			/*Required Steps: (Mailchimp Server, App Server)
				1) Check origin of the contact
				2) If origin is YP, change to non origin
				3) Check if contact is in mailing list
				4) Update mail chimp server then app server
				6) Update the contacts 
				=== SAMPLE POST ===
				{
					"contact":"",
					"firstName":"",
					"lastName":""
				}
				*/
		var cid= req.body.contactID;
		MailinglistManager.getMailingListMemberInfo('mailinglists',cid)
				.then(function(results){		
					if(results.length!=0)
					{//there is a contact in mailing list that need to be deleted.
						console.log(results);
						var temp={
								subscriberStatus: results[0].subscriberStatus,
								email_address: results[0].email_addr,
								merge_fields:{
									FNAME: req.body.firstName,
			    					LNAME: req.body.lastName
								}
							}
							console.log(temp);
						MailchimpManager.updateMember(apiKey,results[0].listID,results[0].email_hash,temp) //1-
						.then(function(MCresults){
							/*
	    	  status : memberInfo.status,
		      email_address : memberInfo.email_address,
		      merge_fields: memberInfo.merge_fields
							*/

							MailinglistManager.updateMemberInfo('mailinglists',req.body,results[0].listID,results[0].email_hash) //1-
							.then(function(MLResults){
								console.log("update success");
								ContactsManager.updateContacts(req.body)
								.then(function(results){
									returnStatusCode(res,200);
								})
								.catch(function(error){
									returnStatusCode(res,error);
								})
							}).catch(function(MLerror)
								{
									console.log(MLerror);
								})
						}).catch(function(MCerror)
							{
								console.log(MCerror);
							})
					}else
					{
						ContactsManager.updateContacts(req.body)
						.then(function(results){
							returnStatusCode(res,200);
						})
						.catch(function(error){
							returnStatusCode(res,error);
						})
					}
			}).catch(function(error)
			{
				console.log(error);		
			})
		}
	});

apiRouter.delete('/contacts/leadList/leads/duplicate',jsonParser,function(req,res){
  if(!req.body)
    res.sendStatus(400);
  else{
    dbHandler.dbRemoveDuplicate('leadList',req.body.fieldName)
    .then(function(results){
      res.sendStatus(200);
    })
    .catch(function(error){
      res.sendStatus(500  );
    })
  }
})

apiRouter.get('/contacts/leadList/leads/:id',function(req,res){
  //TODO return history of lead
  if(!req.params.id)
    res.sendStatus(400);
  else{
    var obj = {
      _id  : req.params.id
    }
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
    res.sendStatus(400);
  else{
    if(!Array.isArray(req.body))
      res.sendStatus(400);
    else{
      ContactsManager.addBulkContacts(res,req.body,returnStatusCode);
    }
  }
});

/*
CRUD on leads list
*/

	/* 	===SAMPLE POST JSON===
	[
	    {
	    "apiKey": "a21a2e3e5898ad6e1d50046f8c33b8ff-us13"
	    }
	]
	*/
apiRouter.route('/contacts/mailingList')
	.get(function(req,res){ 
		if(!req.body)
			returnStatusCode(res,400);
		else{
		//Sync mailchimp
			MailchimpManager.syncContacts(apiKey)
				.then(function(SResults){
					console.log("MailinglistManager.updateMemberInfo Results:");
					console.log(SResults);
					MailinglistManager.getListNames(res,'mailinglists', displayResultsCallback);
				}).catch(function(error)
				{
					console.log("sync Error"+error);
				})
		}
	})
	/* 	===SAMPLE POST JSON===
	[
	    {
	    "listName": "PostingList1",
	  //  "apiKey": "a21a2e3e5898ad6e1d50046f8c33b8ff-us13"
	    }
	]
	*/
	.post(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			//create mailinglist
			MailchimpManager.addList(apiKey,req.body.listName) //1- 
				.then(function(MCResults)
				{
				console.log("Mailchimp.addList Results:");
				console.log(MCResults);
				var addObject = 
					{
						contactID:'-',
						listID: MCResults.id,
						name: MCResults.name,
						email_addr: '-',
						email_hash: '-',
						firstName: '-',
						lastName: '-',
						subscriberStatus: '-'
					}
				
				MailinglistManager.addList(res,'mailinglists',addObject,returnStatusCode);//1
				}).catch(function(MCerror)
				{
					console.log(MCerror);
				})
		}
	})
	.delete(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			/*Required Steps: (Mailchimp Server, App Server)
				1) Remove mailing list from mailchimp
				2) When completed remove the list from app server*/
				MailchimpManager.deleteList(apiKey,req.body.listID)//1-
					.then(function(MCResults)
					{
					MailinglistManager.deleteList(res,'mailinglists',req.body,returnStatusCode);//1-				
					}).catch(function(MCError)
					{
						console.log(MCError);
					})
		}
	})
	.patch(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			/*Required Steps: (Mailchimp Server, App Server)
				1) Update mailchimp with new name
				2) Update app server with new name*/
				/* ===SAMPLE JSON POST ===
					{
					    "update":
					    [{
						"listID":"ba458816f3",
						"name":"PL3"
						},{
						"listID":"ba458816f3",
						"name":"PL4test"
						}
						]
					}
				*/
	MailchimpManager.getListInformation(apiKey,req.body.update[1].listID).then(function(results)
	{
		console.log(results);
		var temp ={
					listID: results.id,
					name: req.body.update[1].name,
			  		contact	: results.contact,
			  	 permission_reminder:results.permission_reminder,
			  	 campaign_defaults:results.campaign_defaults,
			  	 email_type_option: results.email_type_option
		}
		//package the retrieve information
				console.log(temp);
				MailchimpManager.updateList(apiKey,req.body.update[1].listID, temp)
					.then(function(MCResults)
					{
						MailinglistManager.updateList(res,'mailinglists',req.body.update,returnStatusCode);
					}).catch(function(MCError)
					{
						console.log(MCError);
					})
		})
	}
});

	apiRouter.route('/contacts/mailingList/subscriber')
	.post(jsonParser,function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			/* 1) Add subscriber into mailchimp according to list 
			   2) After creating the batch, add the members in mailing list table
			   addMemberToList: function(apiKey,listID,memberInfo)
				=====SAMPLE POST =====
			       {
				    "listID": "4467d29715",
				    "listName" : "PostingList2",
				     "memberInfo" : [
					        {
					        	"contactID" : "21345",
					      "status"        : "subscribed",
					      "email_address" : "aaa@jobs.com",
						      "merge_fields": {
							    "FNAME": "aa",
							    "LNAME": "AA"
				 			 }
				 			 }, { 
				 			 "contactID" : "21345",
				 			"status"        : "subscribed",
					      "email_address" : "cccc@jobs.com",
						      "merge_fields": {
							    "FNAME": "cccc",
							    "LNAME": "cccc"
				 			 }
					    }, {
					    	"contactID" : "21345",
					      "status"        : "subscribed",
					      "email_address" : "bbbbb@jobs.com",
						      "merge_fields": {
							    "FNAME": "bbb",
							    "LNAME": "bbb"
				 			 }
					    }
				        ]
				    }
			// */
			console.log(req.body.memberInfo);
			MailchimpManager.addMemberToList(apiKey,req.body.listID,req.body.memberInfo)
				.then(function(MCResults)
				{
				console.log(MCResults);
				var obj=[];
				for(var i = 0; i<req.body.memberInfo.length;i++)
				{
					var temp={
						contactID:req.body.memberInfo[i].contactID,
						listID: req.body.listID,
						name: req.body.listName,
						email_addr: req.body.memberInfo[i].email_address,
						email_hash: md5(req.body.memberInfo[i].email_address),
						firstName: req.body.memberInfo[i].merge_fields.FNAME,
						lastName: req.body.memberInfo[i].merge_fields.LNAME,
						subscriberStatus: 'subscribed'
					}
					obj.push(temp);
				}
				console.log(obj);
				MailinglistManager.addMemberToList(res,'mailinglists',obj,returnStatusCode);
				})
		}
	})
	//Remove member from mailing list
	.delete(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
					if(req.body.delete.length!=0)
					{//there is a contact in mailing list that need to be deleted.
						/*	====SAMPLE POST====
							{
							   "delete":
							    [{"listID": "6b444f37c4",
								"email_hash": "91bb87a98edc7e2f45c605a46d12d65b",
								"_id":"aaaaa"
								},
							       {"listID": "6b444f37c4",
							       "email_hash": "1ff577ac1929480c2510398aa4999cad",
							       "_id":"aaaaa"
							       }    
								]
							}
						*/
						console.log("getMailingListMemberInfo Results:");
						var promiseArr = [];
						for(var i=0;i<req.body.delete.length;i++){
							promiseArr.push(MailchimpManager.deleteMember(apiKey,req.body.delete[i].listID,req.body.delete[i].email_hash));
						}
						Promise.all(promiseArr)
						.then(function(MCresults){
						console.log("MailchimpManager.deleteMember PromiseArr Results:");
						console.log(MCresults);                       
							MailinglistManager.deleteMember(res,'mailinglists',req.body.delete,returnStatusCode);
						}).catch(function(MCerror)
							{
								console.log(MCerror);
							})
						}
		}
	});
		apiRouter.route('/dropcollection')
			.get(function(req,res){
				if(!req.body)
					returnStatusCode(res,400)
				else{
					MailinglistManager.dbDropCollection(res,'mailinglists',returnStatusCode);
				}
			});


/*
CRUD on fields
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
      res.sendStatus(400);
    else{
      if(req.body.field == undefined || req.body.field == null || req.body.field== '')
        res.sendStatus(400);
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
      res.sendStatus(400);
    else{
      if(req.body.field == undefined || req.body.field == null || req.body.field == '')
        res.sendStatus(400);
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
      res.sendStatus(400);
    else{
      if(req.body.domainName == undefined || req.body.domainName == null || req.body.domainName == '')
        res.sendStatus(400);
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
      }
    }
  })
  .delete(jsonParser,function(req,res){
    if(!req.body)
      res.sendStatus(400);
    else{
      if(req.body.domainName == undefined || req.body.domainName == null || req.body.domainName == '')
        res.sendStatus(400);
      else{
        var str = req.body.domainName;
        ContactsManager.deleteDomain(req.body)
        .then(function(results){
          res.sendStatus(results);
        })
        .catch(function(error){
          res.sendStatus(error);
        })  
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
      res.sendStatus(400);
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
    res.sendStatus(400);
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
    res.sendStatus(400);
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
    res.sendStatus(400);
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
    res.sendStatus(400);
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
    res.sendStatus(400);
  else{
    if(!Array.isArray(req.body))
      res.sendStatus(400);
    else{
      ContactsManager.addBulkContacts(res,req.body,returnStatusCode);
    }
  }
})


apiRouter.post('/test',jsonParser,function(req,res){
  if(!req.body)
    res.sendStatus(400);
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
callback functions
*/
var displayResultsCallback = function(res,results){
  res.json(results);
};

var returnStatusCode = function(res,statusCode){
	res.sendStatus(statusCode);
};

var deleteContact = function(cid)
	{
		return new Promise (function(resolve,reject) {
			/* User removes user from contacts, ripple effects to mailchimp and mailing list
			Required Steps: (Mailchimp Server, App Server)
				1) Check mailing list for that contact
				2) If found remove them from mailing list and mailchimp
				3) when both completed delete from app server database.*/
				var CID= cid;
				var temp ={
					contactID:cid
				}
				MailinglistManager.getMailingListMemberInfo('mailinglists',CID)// 1 -
				.then(function(results){
					if(results.length!=0)
					{//there is a contact in mailing list that need to be deleted.
						console.log(results);
						var promiseArr = [];
						for(var i=0;i<results.length;i++){
							promiseArr.push(MailchimpManager.deleteMember(apiKey,results[i].listID,results[i].email_hash))
						}
						Promise.all(promiseArr)
						.then(function(MCresults){
							MailinglistManager.deleteListv2('mailinglists',temp)
							.then(function(MLResults){				
								console.log("Delete from contacts");
								ContactsManager.deleteLeads(req.body)
								.then(function(results){
									resolve(MLResults);
								})
								.catch(function(error){
									reject(error);
								})		
								//ContactsManager.deleteLeadsCB(res,'localCorporate',req.body,returnStatusCode);
								//Add a then method here
								//returnStatusCode(res,200);
							}).catch(function(MLerror)
								{
									console.log(MLerror);
								})
						}).catch(function(MCerror)
							{
								console.log(MCerror);
							})
						}else
						{
					Console.log("Delete from contacts");	
					resolve(results);
					//ContactsManager.deleteLeadsCB(res,'localCorporate',req.body,returnStatusCode);
					//add a then function
				}
			}).catch(function(error)
			{
				console.log(error);		
			})

	})
	}
module.exports = apiRouter;