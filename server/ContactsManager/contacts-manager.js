var dbHandler = require('../database-handler'),
config = require('../config'),
common = require('../common'),
Promise = require('bluebird');

var ContactsManager = {
	displayLeadCB : function(res,collectionName,obj,callback){
		dbHandler.dbQuery(collectionName,obj)
		.then(function(results){
			callback(res,results);
		})
		.catch(function(error){
			callback(res,error);
		});	
	},
	addLeadCB : function(res,collectionName,obj,callback){
		dbHandler.dbInsert(collectionName,obj)
		.then(function(results){
			callback(res,results);
		})
		.catch(function(error){
			callback(res,error);
		});
	},
	deleteLeadsCB : function(res,collectionName,obj,callback){
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
	updateLeadCB : function(res,collectionName,obj,callback){
		if((Array.isArray(obj)) && obj.length == 2){
			console.log(obj[0]);
			console.log(obj[1]);
			dbHandler.dbUpdate(collectionName,obj[0],obj[1])
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
	// removefield : function(res,)

};


module.exports = ContactsManager;