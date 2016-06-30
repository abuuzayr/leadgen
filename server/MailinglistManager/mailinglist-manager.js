var dbHandler = require('../database-handler'),
config = require('../config'),
common = require('../common'),
mongodb = require('mongodb')
Promise = require('bluebird');

var MailinglistManager = {

	getMailingListMemberInfo : function(collectionName, cID){
		return new Promise (function(resolve,reject) {
		 var obj={
		  contactID : cID
		 }
			 dbHandler.dbQuery(collectionName,obj)
			.then(function(results){
				resolve(results);
			})
			.catch(function(error){
				console.log(error);
			})
		})
	},//('mailinglists',req.body,results.listID,results.suscribeHash)
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
			dbHandler.dbQuery(collectionName,null)
			.then(function(results){
				results = getUniqueLists(results);
				callback(res,results);
			})
			.catch(function(error){
				callback(res,error);
			})	
	},
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
		}
	}

module.exports = MailinglistManager;

function getUniqueLists(results){
		//get the unique lists
		return results;
	}