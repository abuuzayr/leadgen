var dbHandler = require('../database-handler'),
config = require('../config'),
common = require('../common'),
mongodb = require('mongodb')
Promise = require('bluebird');

var MailinglistManager = {

	getMailingListMemberInfo : function(collectionName, cID){
		return new Promise (function(resolve,reject) {
		 var obj={
		  contactID : cID;
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
				listID:lID;
				subscribeHash:sHash;
			}
			dbHandler.dbUpdate(collectionName,object1,obj)
			.then(function(results){
				resolve(results);
			})
			.catch(function(error){
				console.log(error);
			})
	})
	},
	addList: function(res,collectionName,obj,MCadd,callback)
	{
		//create new Mailing List Object
		//define new object with MCadd results
		obj = {
		MLID : MCADD.id;

		}
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
			dbHandler.dbDelete(collectionName,obj)
			.then(function(results){
				callback(res,200);
			})
			.catch(function(error){
				callback(res,error);
			});
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
	deleteMember: function(collectionName,obj)
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
				resolve(results);
			})
			.catch(function(error){
				callback(res,error);
			})
		}
		}
	}

};
module.exports = MailinglistManager;

function getUniqueLists(results){
		//get the unique lists
		return results;
	}