var express = require('express'),
apiRouter = express.Router(),
dbHandler = require('../database-handler'),
jsonParser = require('body-parser').json(),
ContactsManager = require('../ContactsManager/contacts-manager'),
ScrapManager = require('../ScrapingManager/scrap-manager'),
md5 = require('blueimp-md5');
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
apiRouter.route('/contacts/leadList/contacts')
	.get(function(req,res){
		ContactsManager.displayLeadCB(res,'contacts',null,displayResultsCallback);
	})
	.post(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			ContactsManager.addLeadCB(res,'contacts',req.body,returnStatusCode);
		}
	})
	.delete(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			/*===SAMPLE JSON POST===
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

				console.log('aaaa');
				console.log(results);
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
					"lastName":"",
					"originStatus": ""
				}
				*/
		var cid= req.body.contactID;
		var temp={
			contactID:cid
		}
		MailinglistManager.getMailingListMemberInfo('mailinglists',temp)
				.then(function(results){		
					if(results.length!=0)
					{
						var promiseArr = [];
						for(var i=0;i<results.length;i++)
						{
							promiseArr.push(updateContact(results[i],req.body.firstName,req.body.lastName,req.body));
							console.log(results[i]);
						}
						Promise.all(promiseArr)
						.then(function(results1){

							console.log('aaaa');
							console.log(results1);
							returnStatusCode(res,200);
						})
						.catch(function(error)
						{
							console.log(error);
						})
					}else
					{
					returnStatusCode(res,200);
				}
			}).catch(function(error)
			{
				console.log(error);		
			})
		}
	});

/*
CRUD on leads list
*/
	
	/*
	Purpose: To retrieve information for front end display
	 	===SAMPLE POST JSON===
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
			MailchimpManager.addList(apiKey,req.body.name) //1- 
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
			//Suppose to sort incoming json file into merge fields so that it will be easier to add to mailchimp
			/* 1) Add subscriber into mailchimp according to list 
			   2) After creating the batch, add the members in mailing list table
			   addMemberToList: function(apiKey,listID,memberInfo)
				=====SAMPLE POST =====
			       {
				    "listID": "4467d29715",
				    "name" : "PostingList2",
				     "memberInfo" : [
					        {
					        	"contactID" : "21345",
					      "subscriberStatus"        : "subscribed",
					      "email_addr" : "aaa@jobs.com",
						      "merge_fields": {
							    "firstName": "aa",
							    "lastName": "AA"
				 			 }
				 			 }, { 
				 			 "contactID" : "21345",
				 			"subscriberStatus"        : "subscribed",
					      "email_addr" : "cccc@jobs.com",
						      "merge_fields": {
							    "firstName": "cccc",
							    "lastName": "cccc"
				 			 }
					    }, {
					    	"contactID" : "21345",
					      "subscriberStatus"        : "subscribed",
					      "email_addr" : "bbbbb@jobs.com",
						      "merge_fields": {
							    "firstName": "bbb",
							    "lastName": "bbb"
				 			 }
					    }
				        ]
				    }
			// */
			var memberinfoMC=[];
			for(var i=0;i<req.body.memberInfo.length;i++)
			{
				var temp={
					status:req.body.memberInfo[i].subscriberStatus,
					email_address:req.body.memberInfo[i].email_addr,
					merge_fields:{
						FNAME:req.body.memberInfo[i].merge_fields.firstName,
						LNAME:req.body.memberInfo[i].merge_fields.lastName
					}
				}
				memberinfoMC.push(temp);
			}
			MailchimpManager.addMemberToList(apiKey,req.body.listID,memberinfoMC)
				.then(function(MCResults)
				{
				console.log(MCResults);
				var obj=[];
				for(var i = 0; i<req.body.memberInfo.length;i++)
				{
					var temp={
						contactID:req.body.memberInfo[i].contactID,
						listID: req.body.listID,
						name: req.body.name,
						email_addr: req.body.memberInfo[i].email_addr,
						email_hash: md5(req.body.memberInfo[i].email_addr),
						firstName: req.body.memberInfo[i].merge_fields.firstName,
						lastName: req.body.memberInfo[i].merge_fields.lastName,
						subscriberStatus: 'subscribed'
					}
					console.log(temp);
					obj.push(temp);
				}
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
						var promiseArr = [];
						for(var i=0;i<req.body.delete.length;i++){
							promiseArr.push(MailchimpManager.deleteMember(apiKey,req.body.delete[i].listID,req.body.delete[i].email_hash));
						}
						Promise.all(promiseArr)
						.then(function(MCresults){    
						MailinglistManager.deleteMember(res,'mailinglists',req.body.delete,returnStatusCode);
						}).catch(function(MCerror)
							{
								console.log(MCerror);
							})
						}
		}
	});
apiRouter.route('/mailinglist/getSubscriber')
	.post(function(req,res){
		if(!req.body)
			returnStatusCode(res,400)
		else{
			/*=====Sample Post=== //get members base on list ID
			 	{
					"listID":"",
					"name" : ""
			 	}
			*/
			MailinglistManager.getSubscribers(res,'mailinglists',req.body,displayResultsCallback);
				}
			});
apiRouter.route('/dropcollection')
	.get(function(req,res){
		if(!req.body)
			returnStatusCode(res,400)
		else{
			MailinglistManager.dbDropCollection(res,'contacts',returnStatusCode);
				}
			});
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
CRUD on fields
*/
apiRouter.route('/corporate/contacts/leadList/fields')

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
	});
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
		apiRouter.post('/populateTest',function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			index ++;
			MailinglistManager.populate(req.body,'mailinglists')
			.then(function(results){
				res.sendStatus(res,200);
			})
			.catch(function(error){
				res.sendStatus(400);
			});
		}
	});
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
				MailinglistManager.getMailingListMemberInfo('mailinglists',temp)// 1 -
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
								resolve(MLResults);	
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
					//add a then function
				}
			}).catch(function(error)
			{
				console.log(error);		
			})

	})
	}
var updateContact = function(results,firstName,lastName,body)
	{
		return new Promise (function(resolve,reject) {
			//there is a contact in mailing list that need to be deleted.
					console.log(results);
					var temp={
						status: results.subscriberStatus,
						email_address: results.email_addr,
						merge_fields:{
							FNAME: firstName,
			    			LNAME: lastName
							}
					}
					console.log(temp);
					MailchimpManager.updateMember(apiKey,results.listID,results.email_hash,temp)
					.then(function(MCresults){
						MailinglistManager.updateMemberInfo('mailinglists',body,results.listID,results.email_hash)
						.then(function(MLResults){
							console.log("update success");
							resolve(MLResults);
							}).catch(function(MLerror)
							{
							console.log(MLerror);
							})
						}).catch(function(MCerror)
							{
								console.log(MCerror);
							})

	})
	}
module.exports = apiRouter;