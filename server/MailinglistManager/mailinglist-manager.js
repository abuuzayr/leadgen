var dbHandler = require('../database-handler'),
config = require('../config'),
common = require('../common'),
mongodb = require('mongodb')
contactsHandler = require('../ContactsManager/contacts-manager'),
Promise = require('bluebird');

var MailinglistManager = {

	getMailingListMemberInfo : function(collectionName, obj){
		return new Promise (function(resolve,reject) {
			 dbHandler.dbQuery(collectionName,obj)
			.then(function(results){
				resolve(results);
			})
			.catch(function(error){
				reject(error);
			})
		})
	},
	updateMemberInfo: function(collectionName, obj, lID, sHash){
	return new Promise (function(resolve,reject) {
			var object1={
				listID:lID,
				email_hash:sHash
			}
			console.log(object1);
			console.log(obj);
			dbHandler.dbUpdate(collectionName,object1,obj)
			.then(function(results){
				resolve(results);
			})
			.catch(function(error){
				console.log(error);
			})
	})
	},
	addList: function(res,collectionName,obj,callback)
	{
		//create new Mailing List Object
		//define new object with MCadd results
		dbHandler.dbInsert(collectionName,obj)
		.then(function(results){
			callback(res,200);
		})
		.catch(function(error){
			callback(res,error);
		});
	},
	addListMC: function(collectionName,obj)
	{
	return new Promise (function(resolve,reject) {		
		//create new Mailing List Object
		//define new object with MCadd results
		dbHandler.dbInsert(collectionName,obj)
		.then(function(results){
			resolve(results);
		})
		.catch(function(error){
			console.log('addList'+error);
		})
	})

	},
	addContactsChain: function(collectionName,obj)
	{
		return new Promise (function(resolve,reject) {	
			var tempC={
				firstName:obj.firstName,
				lastName:obj.lastName,
				email:obj.email_addr
			}
			contactsHandler.addContactMC(tempC)
			.then(function(results){
				var tempML={
					contactID: results,
					listID: obj.listID,
					name: obj.name,
					email_addr: obj.email_addr,
					email_hash: obj.email_hash,
					firstName: obj.firstName,
					lastName: obj.lastName,
					subscriberStatus: obj.subscriberStatus
				}
				console.log(tempC);
				console.log(tempML);
				dbHandler.dbInsert(collectionName,tempML)
					.then(function(result)
					{
						resolve(result);
					}).catch(function(MLerror){
						console.log('insertML'+error)
					})
			})
			.catch(function(error){
				console.log('insertcontacts error'+error);
			});
		})
	},	
	deleteList: function(res,collectionName,obj,callback)
	{
			dbHandler.deleteManyDB(collectionName,obj)
			.then(function(results){
				callback(res,200);
			})
			.catch(function(error){
				callback(res,error);
			});
	},	
	deleteListv2: function(collectionName,obj)
	{
		return new Promise (function(resolve,reject) {
			console.log('this is obj');
			console.log(obj);
			dbHandler.deleteManyDB(collectionName,obj)
			.then(function(results){
				resolve(results);
			})
			.catch(function(error){
				reject(error);
			})
	})
	},
	getListNames: function(res,collectionName,callback)
	{		
			//This is to allow us to filter out mailing list names only.
			var obj={
				email_hash:'-',
				email_addr:'-'
			}
			dbHandler.dbQuery(collectionName,obj)
			.then(function(results){
				results = getUniqueLists(results);
				callback(res,results);
			})
			.catch(function(error){
				callback(res,error);
			})	
	},
	updateContactMC: function(collectionName,obj)
	{		
			return new Promise (function(resolve,reject) {
			//This is to allow us to filter out mailing list names only.
			dbHandler.dbQuery(collectionName,obj[0])
			.then(function(results){
							console.log('bb');
				console.log(results);
				var temp=[{
					listID:obj[0].listID,
					contactID:results[0].contactID,
					email_hash:obj[0].email_hash
				},{
					firstName:obj[1].firstName,
					lastName:obj[1].lastName,
					subscriberStatus:obj[1].subscriberStatus
				}];
				console.log(temp[0]);
				console.log(temp[1]);
				dbHandler.dbUpdateMany(collectionName,temp[0],temp[1])
				.then(function(results1){
					//After integration
					var temp2=[{
						_id:results.contactID
					},{
						firstName:object[1].firstName,
						lastName:object[1].lastName
					}];
					dbHandler.dbUpdateMany('leadList',temp2[0],temp2[1])
						.then(function(results2)
						{
							resolve(results2);
						})
						.catch(function(error2){
							console.log("updatecontact2"+ error2)
						})
						console.log('update success!');
						resolve(results1);
				}).catch(function(error)
				{
					console.log('updateContactMC updateML'+error);
				})
			})
			.catch(function(error){
				console.log('updateContactMC query',error);
			})	
		})
	},
	getListNamesMC: function(collectionName)
	{		
			//This is to allow us to filter out mailing list names only.
		return new Promise (function(resolve,reject) {
			var obj={
				email_hash:'-',
				email_addr:'-'
			}
			dbHandler.dbQuery(collectionName,obj)
			.then(function(results){
				 resolve(results);
			})
			.catch(function(error){
				console.log('trying getListNamesMC failed :'+error);
			})
		})
	},
	getAllMembers: function(collectionName)
	{		
		return new Promise (function(resolve,reject) {
			dbHandler.dbQuery(collectionName,null)
			.then(function(results){
				 resolve(results);
			})
			.catch(function(error){
				console.log('trying to get all members failed :'+error);
			})
		})
	},
	populate: function(obj,collectionName)
	{		
			//This is to allow us to filter out mailing list names only.
		if(!Array.isArray(obj)){
			dbHandler.dbInsert(collectionName,obj)
			.then(function(results){
				resolve(results);
			})
			.catch(function(error){
				resolve(results);
			});
		}else{
			var arr = [];
			for(var index in obj){
				arr.push(dbHandler.dbInsert(collectionName,obj[index]));
			}
			Promise.all(arr)
			.then(function(results){
				resolve(results);
			})
			.catch(function(error){
				resolve(results);
			})
		}
		}
	,
	addMemberToList: function(res,collectionName,obj,callback)
	{
			if(!Array.isArray(obj)){
			dbHandler.dbInsert(collectionName,obj)
			.then(function(results){
				callback(res,results);
			})
			.catch(function(error){
				callback(res,error);
			});
		}else{
			var arr = [];
			for(var index in obj){
				arr.push(dbHandler.dbInsert(collectionName,obj[index]));
			}
			Promise.all(arr)
			.then(function(results){
				callback(res,200);
			})
			.catch(function(error){
				callback(res,error);
			})
		}
	},
	addMemberToListMC: function(collectionName,obj)
	{
		return new Promise (function(resolve,reject) {
			dbHandler.dbInsert(collectionName,obj)
			.then(function(results){
				resolve(results);
			})
			.catch(function(error){
				console.log('addMemberToListMC'+error)
			})
		})

	},
	dbDropCollection: function(res,collectionName,callback)
	{
		dbHandler.dbDropCollection(collectionName)
		.then(function(results){
			callback(res,200);
		})
		.catch(function(error){
			callback(res,error);
		})
	},
	updateList : function(res,collectionName,obj,callback){
		if((Array.isArray(obj)) && obj.length == 2){
			console.log(obj[0]);
			console.log(obj[1]);
			dbHandler.dbUpdateMany(collectionName,obj[0],obj[1])
			.then(function(results){
				callback(res,results);
			})
			.catch(function(error){
				callback(res,error);
			});
		}else{
			callback(res,400);
		}
	},
		getSubscribers : function(res,collectionName,obj,callback){

			var temp ={
				listID : obj.listID
			}
			dbHandler.dbQuery(collectionName,temp)
			.then(function(results){
				callback(res,results);
			})
			.catch(function(error){
				callback(res,error);
			});
	},
	updateListMC : function(collectionName,obj){

		return new Promise (function(resolve,reject) {
		if((Array.isArray(obj)) && obj.length == 2){
			console.log(obj[0]);
			console.log(obj[1]);
			dbHandler.dbUpdateMany(collectionName,obj[0],obj[1])
			.then(function(results){
				resolve(results);
			})
			.catch(function(error){
				console.log('updateListMC'+error);
			});
		}
			})
	},
	deleteMember: function(res,collectionName,obj,callback)
	{
		if(!Array.isArray(obj)){
			dbHandler.dbDelete(collectionName,obj)
			.then(function(results){
				callback(res,results);
			})
			.catch(function(error){
				callback(res,error);
			});
		}else{
			var arr = [];
			for(var index in obj){
				arr.push(dbHandler.dbDelete(collectionName,obj[index]));
			}
			Promise.all(arr)
			.then(function(results){
				callback(res,200);
			})
			.catch(function(error){
				callback(res,error);
			})
		}
		},
	deleteMemberMC: function(collectionName,obj)
	{
		return new Promise (function(resolve,reject) {
			dbHandler.dbDelete(collectionName,obj)
			.then(function(results){
				resolve(results);
			})
			.catch(function(error){
				console.log("deleteMemberMC"+error)	
			})
		})
	},
	addReportActivity: function(collectionName,obj)
	{
		return new Promise (function(resolve,reject) {
			var queryTemp={
				listID:obj.listID,
				email_hash:obj.email_hash
			}
		dbHandler.dbQuery(collectionName,queryTemp)
		.then(function(results){//containing contactid
			obj.contactID=results[0].contactID;
			resolve(obj);
		})
		.catch(function(error){
			console.log('addList'+error);
		})
		})
	},
	getAllData: function(collectionName)
	{
		return new Promise (function(resolve,reject) {

		dbHandler.dbQuery(collectionName,null)
		.then(function(results){//containing contactid
			resolve(results);
		})
		.catch(function(error){
			console.log('addList'+error);
		})
		})
	},
	updateActivity : function(collectionName,obj){
		return new Promise (function(resolve,reject) {

				var obj1=[{
					_id:obj._id
				},{
					history:obj.history
				}];
				console.log('test');
				console.log(obj1[0]);
				console.log(obj1[1]);
				dbHandler.dbUpdateMany(collectionName,obj1[0],obj1[1])
				.then(function(results){
					resolve(results);
				})
				.catch(function(error){
					console.log('updateListMC'+error);
				});
			})
	}
}

module.exports = MailinglistManager;

function getUniqueLists(results){
		//get the unique lists
		return results;
	}