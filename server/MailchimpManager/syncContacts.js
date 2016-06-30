
var mailchimpClass= require('./mailchimpApp');
var Promise = require('bluebird');
var mailchimpHandler ={
	syncContacts: function(apiKey){
		return new Promise (function(resolve,reject) {

		mailchimpClass.getMyList(apiKey)
		.then(function(results)
		{
			var mailchimplist;
			var fakeDatabase;
			//step one, retrieve results from mailchimp
			mailchimplist = results;
			//fake data
			
		//	fakeDatabase=results;
		 	fakeDatabase = JSON.parse(JSON.stringify(results));
			fakeDatabase[0].list_name ='updated name 2';
			fakeDatabase[0].members[0].email='aaaaaaaaaaa'
			//fakeDatabase[1].list_name = 'Updated name 1';
			fakeDatabase.pop();
			fakeDatabase[0].members.pop();
			var fakeObj = {
				list_name : 'Deleted at mailchimp',
				list_id : 'aaaaaaaaaaa',
				members : []
			};
			var fakemember={
			id : '11111',
			email : '22222',
			status : '33333',
			firstName : '44444',
			lastName : '55555'
			}
			fakeDatabase.push(fakeObj);
			fakeDatabase[0].members.push(fakemember);
			fakeDatabase[fakeDatabase.length-2].members.push(fakemember);
			console.log("====================Fake Database ========================================");
			for(var i =0;i<fakeDatabase.length;i++){
			console.log(fakeDatabase[i]);
			}
			console.log("=========================================================");
			console.log("====================mailchimp Database ========================================");
			for(var i =0;i<mailchimplist.length;i++){
			console.log(mailchimplist[i]);
			}
			console.log("=========================================================");
			var returnArr=[];
			returnArr.push(mailchimplist);
			returnArr.push(fakeDatabase);
			return returnArr;
		})
		.then(function(returnArr){
			//Now that we have both results, we compare them to see if there are the same,
			//firstly we want to check that we have the most updated listname.
			//Since when CRUD is performed at MC, contacts will not be updated immediately, we assume that MC will have the most updated ver.
			var differenceArr=[];// this is detect and record down any difference found while comparing the two array
			var mailchimplist=returnArr[0];
			var fakeDatabase=returnArr[1];
			//start looping
			var i,j;
			for(i=0;i<mailchimplist.length;i++)
			{
				var listfound = false;
				for(j=0;j<fakeDatabase.length;j++)
				{
					if(fakeDatabase[j].list_id == mailchimplist[i].list_id)
					{
					listfound=true; //we've found the same list!
					var temp={
						list_name : mailchimplist[i].list_name,
						list_id : mailchimplist[i].list_id,
						members : [],
						action : '0' // 0 - default, 1 - update list name only, 2- update members info only, 3 update both member and list name
						}
						//check if their name is still the same
						if(fakeDatabase[j].list_name != mailchimplist[i].list_name)
						{
							//user has changed the name of the list a mailchimp side!
							temp.action = '1';
						}
						var membTemp=[];// Array of objects
						membTemp = compareMemberLists(mailchimplist[i].members, fakeDatabase[i].members);

						if(membTemp.length != '0')
						{
							if(temp.action == '1')
							{
								temp.action = '3';
							}else
							{
								temp.action = '2';
							}
							temp.members= membTemp;
						}
						if(temp.action!= '0')
						{	
							differenceArr.push(temp);
						}					
					}
				}//check if users has created lists in mailchimp side!
				if(listfound==false)
				{
				var tempt={
					list_name : mailchimplist[i].list_name,
					list_id : mailchimplist[i].list_id,
					members : mailchimplist[i].members,
					action : '4'//to denote an create
					}
				differenceArr.push(tempt);	
				}
			}
			//now to detect if the user deletes on the mailchimp side
			for(i=0;i<fakeDatabase.length;i++)
			{
				var listfound = false;
				for(j=0;j<mailchimplist.length;j++)
				{	
					if(fakeDatabase[i].list_id == mailchimplist[j].list_id)
					{
						//to denote that the list exist at both severs
						 listfound = true;
					}
				}
				if(!listfound)
				{
					//if not found, it means that user has deleted the list on the mailchimp server
					//we will attempt to remove from our side as well.
					var tempt={
					list_name : fakeDatabase[i].list_name,
					list_id : fakeDatabase[i].list_id,
					members : fakeDatabase[i].members,
					action : '5'//to denote an delete
					}
						differenceArr.push(tempt);
					}
			}
			return differenceArr;
		}).then(function(differenceArr){
			console.log("====================Update Database ========================================");
			for(var i =0;i<differenceArr.length;i++){
				console.log(differenceArr[i]);
				}
			console.log("=====================================================================");
			//filter the different actions to perform, when the update array is completed
			for(var i =0;i<differenceArr.length;i++){
				//go through everylist check the action, perform the action.
				if(differenceArr[i].action == '5')
				{
					//start delete call

				}else if(differenceArr[i].action == '4')
					{
						//its a create call
						//method call to create ML
						if(differenceArr[i].members != '0')
						{
							for(var j =0;j<differenceArr[j].members;j++)
							{
								//create mmembers mehod here

							}
						}
					}else if(differenceArr[i].action == '3')
					{
						//update members and listname
						//include list method
						//loop members
						for(var j =0;j<differenceArr[j].members;j++)
						{
							//identify the type of update C/U/D
							if(differenceArr[j].members[j].action=='3')
							{
								//update member

							}else if(differenceArr[j].members[j].action=='2')
							{
								//create member

							}else if(differenceArr[j].members[j].action=='1')
							{ 
								//delete member
							}
						}
					}
					else if(differenceArr[i].action == '2')
					{
						//update members only

					}
					else if(differenceArr[i].action == '1')
					{
						//updatelistname only
					}
			}		
		})
		.catch(function(error){
			console.log('error getting information :' + error);
		}).done(function()
		{
		 	mailchimpClass.getReports(getReportDetails, resolve, reject);
		})
		})
	},
	updateList: function(apiKey,listID, tempInfo)
	{
	return new Promise (function(resolve,reject) {

		mailchimpClass.updateList(apiKey,listID, tempInfo)
			.then(function(results)
			{	
			resolve(results);
			}).catch(function(error)
			{
				console.log("Sync Contact update Error"+error);
			})
		})
	},addList: function(apiKey,listName)
	{
	return new Promise (function(resolve,reject) {

		mailchimpClass.addList(apiKey,listName)
			.then(function(results)
			{	
			resolve(results);
			}).catch(function(error)
			{
				console.log("Sync Contact add list Error"+error);
			})
		})		

	},addMemberToList: function(apiKey,listID,memberInfo)
	{
	return new Promise (function(resolve,reject) {
		mailchimpClass.addMemberToList(apiKey,listID,memberInfo)
			.then(function(results)
			{	
			resolve(results);
			})
			.catch(function(error)
			{
				console.log("Sync Contact addMemberToList "+error);
			})
		})
		},
	getListInformation : function(apiKey,listID)
	{
	return new Promise (function(resolve,reject) {
		mailchimpClass.getListInformation(apiKey,listID)
			.then(function(results)
			{	
			resolve(results);
			}).catch(function(error)
			{
				console.log("Sync contact update Error"+error);
			})
	})
	},
	deleteMember: function(apiKey,listID,suscribeHash)
	{
		return new Promise (function(resolve,reject) {
		mailchimpClass.deleteMember(apiKey,listID,suscribeHash)
		  			 .then(function(results){
			   			resolve(results);
			   		})
		  		.catch(function(error){
		  	console.log('Sync Contact deleteMember'+error);
		  })
		})
	},
	deleteList: function(apiKey,listID)
	{
		return new Promise (function(resolve,reject) {
		mailchimpClass.deleteList(apiKey,listID)
		  			 .then(function(results){
			   			resolve(results);
			   		})
		  		.catch(function(error){
		  	console.log('Sync Contact deleteList'+error);
		  })
		})
	}
	,updateMember: function(apiKey,listID,suscribeHash,memberInfo )
	{
	return new Promise (function(resolve,reject) {
			mailchimpClass.updateMember(apiKey,listID,suscribeHash,memberInfo)	
		  	 .then(function(results){
				resolve(results);
			}).catch(function(error)
			{
				console.log("Sync contact update Member Error"+error);
			})
		})
	}
}
module.exports = mailchimpHandler;

	var getReportDetails = function(results, resolve, reject)
	{
		//Sort to handle email activity information
		var activityArr=[];
		console.log("===================Report activity ==============================");
	//console.log(results[0].emails[0].activity);// retrieve activity information.
	//Now we want to collate allthese information and save them into another array
	//mailing list ID and mc id will get us the contact id so we can add the relevant data.
	//if there are duplicate action and timestamp we add action else, dont add action
	for(var i=0;i<results.length;i++){
	 	for(var j=0;j<results[i].emails.length;j++){
	 		var temp={
				mailingListID: results[i].emails[j].list_id,//The unique id for the list.
				campid:  results[i].campaign_id,
				email: results[i].emails[j].email_address,
				mcID: results[i].emails[j].email_id,
				action: results[i].emails[j].activity,
				//One of the following actions: ‘open’, ‘click’, or ‘bounce’ and the date and time recorded for the action.
				contactID: ''
			}
			if(results[i].emails[j].activity.length!=0)
		 		{
				activityArr.push(temp);
		 		}
			}
		}

	// after populating the activity array, we get the contact id so that we can save the contact activity to the contact
	for(var i=0;i<activityArr.length;i++){	
		var contID=1;//getContactID(activityArr[i].mailingListID,activityArr[i].mcID);
		activityArr[i].contactID= contID;
		}
		console.log(activityArr);
	//now that we have the contactID we can add the activity into the Contacts table
	//after adding the activity, be sure to remove duplicates so that we wont have excessive information
	for(var i=0;i<activityArr.length;i++){
		//clear that field first to []
		//then update 1 by 1 add Contact activity addContactActivity(activityArr[i].contactID,activityArr[i].action);
		//update the old field with the latest data
		}
		console.log(activityArr);
		resolve('true');
		//return to front end
	}

	function compareMemberLists(mailchimpMembers, membersDatabase){
		var differenceMemArr = [];
		//console.log("===========================In compareMember lists=====================");
		for(var i =0;i<mailchimpMembers.length;i++)
		{
			var memberFound=false;
			for(var j =0;j<membersDatabase.length;j++)
			{
				if(membersDatabase[j].id == mailchimpMembers[i].id)
				{
					memberFound=true; //we've found the same list!
					var temp={
						 // 0 - default, 1 - update member, 2- create member, 3 delete remove
					 	id : mailchimpMembers[i].id,
					    email : mailchimpMembers[i].email,
						status : mailchimpMembers[i].status,
						firstName : mailchimpMembers[i].firstName,
						lastName : mailchimpMembers[i].lastName,
						action: '0'
					}
					//check if their name is still the same
					if(JSON.stringify(mailchimpMembers[i]) != JSON.stringify(membersDatabase[j]))
					{
						//user has changed the name of the list a mailchimp side!
						temp.action = '1';// to denote member update at mailchimp side
						differenceMemArr.push(temp);
					}
				}
			}
			if(!memberFound)
			{
				var temp={
						 // 0 - default, 1 - update member, 2- create member, 3 delete remove
					id : mailchimpMembers[i].id,
					email : mailchimpMembers[i].email,
					status : mailchimpMembers[i].status,
					firstName : mailchimpMembers[i].firstName,
					lastName : mailchimpMembers[i].lastName,
					action: '2'
				}	
				differenceMemArr.push(temp);			
			}
		}
		//find deleted members
		for(var i =0;i<membersDatabase.length;i++)
		{
			var memberFound=false;
			for(var j =0;j<mailchimpMembers.length;j++)
			{
				if(membersDatabase[i].id == mailchimpMembers[j].id)
				{
					memberFound=true; //we've found the same list!
				}
			}
			if(!memberFound)
			{
				//member got removed at mailchimp
					var temp={
						 // 0 - default, 1 - update member, 2- create member, 3 delete remove
					 	id : membersDatabase[i].id,
					    email : membersDatabase[i].email,
						status : membersDatabase[i].status,
						firstName : membersDatabase[i].firstName,
						lastName : membersDatabase[i].lastName,
						action: '3'
					}	
					differenceMemArr.push(temp);
			}
		}
		//console.log("=======================================================================");
		return differenceMemArr;
	}