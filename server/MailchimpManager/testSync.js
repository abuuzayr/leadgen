var mailchimpHandler= require('./syncContacts');
var apiKey = 'a21a2e3e5898ad6e1d50046f8c33b8ff-us13';

/* This is to test syncing function between mailchimp and app server.

mailchimpHandler.syncContacts(apiKey).then(function(results)
{
	console.log("This is resuaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalts");
	console.log(results);
})
*/
//Thisis to test update list function
/*
	mailchimpHandler.getListInformation(apiKey,'c2dfb8e7e9').then(function(results)
	{
		console.log("This is resuaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalts");

		var temp ={
					name: 'notregulartest1',
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
		mailchimpHandler.updateList(apiKey,'c2dfb8e7e9',temp).then(function(results)
		{
		console.log("This is resuaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalts");
		console.log(results);
		})
})
*/
//This is to create list
//3fadfd5a8b
//91bb87a98edc7e2f45c605a46d12d65b
/*
mailchimpHandler.addList(apiKey,'CreateListTest1').then(function(results)
	{
		console.log("This is resuaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalts");
		console.log(results)
	})
	*/

/*this is to create member in the list*/ 
/*
	var batches = [
	  {
	    body: {
	      status        : 'subscribed',
	      email_address : 'aaa@jobs.com',
		      merge_fields: {
			    FNAME: 'aa',
			    LNAME: 'AA'
 			 }
	    }
	  }, {
	    body: {
	      status        : 'subscribed',
	      email_address : 'bbb@lightbulbs.com',
		      merge_fields: {
			    FNAME: 'bb',
			    LNAME: 'BB'
 			 }
	    }
	  }, {
	    body: {
	      status        : 'subscribed',
	      email_address : 'ccc@puff.com',
		      merge_fields: {
			    FNAME: 'cc',
			    LNAME: 'CC'
 			 }
	    }
	  }
	];
	mailchimpHandler.addMemberToList(apiKey,'3fadfd5a8b',batches).then(function(results)
	{
		console.log("This is resuaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalts");

 			 		console.log(results);
 			 	})
 			 	*/
 	//this is to update members
 	//so apparently no need to update contact a all @_@
 	/*
 	var tempMember={
 					status: 'subscribed',
	   			   email_address : 'dddd@lightbulbs.com',
		      			merge_fields: {
			   			 FNAME: 'dd',
			    		LNAME: 'dd'
 			 				}
			  	 }
 	mailchimpHandler.updateMember(apiKey,'3fadfd5a8b','91bb87a98edc7e2f45c605a46d12d65b',tempMember).then(function(results)
	{
		console.log("This is resuaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalts");

 			 		console.log(results);
 			 	})
 	*/
 	/*this is to delete member
 	 mailchimpHandler.deleteMember(apiKey,'3fadfd5a8b','91bb87a98edc7e2f45c605a46d12d65b').then(function(results)
	{
		console.log("This is resuaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalts");

 			 		console.log(results);
 			 	})*/

 	 /* this is to delete list
	 mailchimpHandler.deleteList(apiKey,'3fadfd5a8b').then(function(results)
	{
		console.log("This is resuaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalts");

 			 		console.log(results);
 			 	})
 	*/