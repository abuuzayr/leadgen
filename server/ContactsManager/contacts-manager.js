var dbHandler = require('../database-handler'),
config = require('../config'),
common = require('../common'),
Promise = require('bluebird');

var ContactsManager = {
	displayContacts : function(res,collectionName,obj,callback){
		dbHandler.dbQuery(collectionName,obj)
		.then(function(results){
			callback(res,results);
		})
		.catch(function(error){
			callback(res,error);
		});	
	},
	addContacts : function(res,collectionName,obj,callback){
		dbHandler.dbInsert(collectionName,obj)
		.then(function(results){
			callback(res,results);
		})
		.catch(function(error){
			callback(res,error);
		});
	},
	deleteContacts : function(res,collectionName,obj,callback){
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
	updateContacts : function(res,collectionName,obj,callback){
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
	removeField : function(res,collectionName,str,callback){
		var arr = [];
		dbHandler.dbQuery(collectionName,null)
		.then(function(results){
			for(var i=0;i<results.length;i++){
				var obj= results[i];
				delete obj[str];
				arr.push(obj);
			}
			return dbHandler.dbDropCollection(collectionName);
		})
		.then(function(results){
			var promiseArr = [];
			for(var i=0;i<arr.length;i++){
				promiseArr.push(dbHandler.dbInsert(collectionName,arr[i]));
			}
			console.log(promiseArr);
			return Promise.all(promiseArr);
		})
		.then(function(results){
			callback(res,200);
		})
		.catch(function(error){
			callback(res,400);
		});
	},
	addField : function(res,collectionName,str,callback){
		var arr = [];
		dbHandler.dbQuery(collectionName,null)
		.then(function(results){
			for(var i=0;i<results.length;i++){
				var obj= results[i];
				if(obj[str] == undefined)
					obj[str] = null;
				arr.push(obj);
			}
			return dbHandler.dbDropCollection(collectionName);
		})
		.then(function(results){
			var promiseArr = [];
			for(var i=0;i<arr.length;i++){
				promiseArr.push(dbHandler.dbInsert(collectionName,arr[i]));
			}
			console.log(promiseArr);
			return Promise.all(promiseArr);
		})
		.then(function(results){
			callback(res,200);
		})
		.catch(function(error){
			callback(res,400);
		});
	}

};


module.exports = ContactsManager;