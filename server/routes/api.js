var express = require('express'),
apiRouter = express.Router(),
dbHandler = require('../database-handler'),
jsonParser = require('body-parser').json(),
ContactsManager = require('../ContactsManager/contacts-manager'),
ScrapManager = require('../ScrapingManager/scrap-manager'),
MailinglistManager = require('../MailingList/mailinglist-manager'),
MailchimpManager= require('../Mailchimp/syncContacts'),
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
			/* User removes user from contacts, ripple effects to mailchimp and mailing list
			Required Steps: (Mailchimp Server, App Server)
				1) Check mailing list for that contact
				2) If found remove them from mailing list and mailchimp
				3) when both completed delete from app server database.*/
				var CID= req.body._id;
				MailinglistManager.getMailingListMemberInfo('mailinglists',CID)// 1 -
				.then(function(results){
					if(results.length!=0)
					{//there is a contact in mailing list that need to be deleted.
						var promiseArr = [];
						for(var i=0;i<results.length;i++){
							promiseArr.push(MailchimpManager.deleteMember(apiKey,results[i].listID,results[i].subscribeHash))
						}
						Promise.all(promiseArr)
						.then(function(MCresults){
							MailinglistManager.deleteMember('mailinglists',results)
							.then(function(MLResults){
								ContactsManager.deleteLeadsCB(res,'localCorporate',req.body,returnStatusCode);
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
					ContactsManager.deleteLeadsCB(res,'localCorporate',req.body,returnStatusCode);
				}
			}).catch(function(error)
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
				6) Update the contacts */
		var cid= req.body[0].contactID;
		MailinglistManager.getMailingListMemberInfo('mailinglists',cid)
				.then(function(results){
					if(results.length!=0)
					{//there is a contact in mailing list that need to be deleted.
						MailchimpManager.updateMemberInfo(apiKey,results[0].listID,results[0].suscribeHash,req.body[1]) //1-
						.then(function(MCresults){
							MailinglistManager.updateMemberInfo('mailinglists',req.body[1],results.listID,results.suscribeHash) //1-
							.then(function(MLResults){
								ContactsManager.updateLeadCB(res,'localCorporate',req.body,returnStatusCode);
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
					ContactsManager.updateLeadCB(res,'localCorporate',req.body,returnStatusCode);
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
apiRouter.route('/contacts/mailingList')
	.get(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
		//Sync mailchimp
			MailchimpManager.syncContacts(apiKey)
				.then(function(SResults){
					MailinglistManager.getListNames(res,'mailinglists', displayResultsCallback);
				}).catch(function(error)
				{
					console.log("sync Error"+error);
				})
		}
	})
	.post(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			//create mailinglist
			Mailchimp.addList(apiKey,req.body.listName) //1- 
				.then(function(MCResults)
				{
				MailingList.addList(res,'mailinglists',req.body,MCResults,returnStatusCode);//1
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
				Mailchimp.deleteList(apiKey,req.body.listID)//1-
					.then(function(MCResults)
					{
					MailingList.deleteList(res,'mailinglists',req.body.listID,returnStatusCode);//1-				
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
	mailchimpHandler.getListInformation(apiKey,req.body.lID).then(function(results)
	{
		var temp ={
					listID: lID,
					name: req.body.name,
			  		contact	: {
			  	 	company:results.company,
			  	 	address1:results.address1,
			  	 	city: results.city,
			  	 	state:results.state,
			  	 	zip:results.zip,
			  	 	country:results.country
			  	 },
			  	 permission_reminder:results.permission_reminder,
			  	 campaign_defaults:results.campaign_defaults,
			  	 email_type_option: results.email_type_option
		}
		//package the retrieve information
				Mailchimp.updateListName(apiKey,req.body.listID, temp)
					.then(function(MCResults)
					{
						MailingList.updateListName()
					}).catch(function(MCError)
					{
						console.log(MCError);
					})
		}
	});

	apiRouter.route('/corporate/contacts/mailingList/subscriber')
	.post(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			/* 1) Add subscriber into mailchimp according to list 
			   2) After creating the batch, add the members in mailing list table
			   addMemberToList: function(apiKey,listID,memberInfo)
			*/
			Mailchimp.addMemberToList(apiKey,listID,memberInfo)
				.then(function(MCResults)
				{
				MailingList.addMemberToList(res,listID,memberInfo,returnStatusCode);
				})
		}
	})//Remove member from mailing list
	.delete(function(req,res){
		if(!req.body)
			returnStatusCode(res,400);
		else{
			/* 1) Add subscriber into mailchimp according to list 
			   2) After creating the batch, add the members in mailing list table
			   addMemberToList: function(apiKey,listID,memberInfo)
			*/
			Mailchimp.deleteMemberFromList(apiKey,listID,memberInfo)
				.then(function(MCResults)
				{
				MailingList.deleteMemberFromList(res,listID,memberInfo,returnStatusCode);
				})		
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



var displayResultsCallback = function(res,results){
	res.json(results);
};

var returnStatusCode = function(res,statusCode){
	res.sendStatus(statusCode);
}

module.exports = apiRouter;