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
	deleteLeadCB : function(res,collectionName,obj,callback){
		dbHandler.dbDelete(collectionName,obj)
		.then(function(results){
			callback(res,results);
		})
		.catch(function(error){
			callback(res,error);
		});
	},
	updateLeadCB : function(res,collectionName,obj1,obj2,callback){
		dbHandler.dbUpdate(collectionName,obj)
		.then(function(results){
			callback(res,results);
		})
		.catch(function(error){
			callback(res,error);
		});
	},

};


module.exports = ContactsManager;