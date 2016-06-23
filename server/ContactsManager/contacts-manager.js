var dbHandler = require('../database-handler'),
config = require('../config'),
common = require('../common'),
fs = require('fs'),
mongodb = require('mongodb'),
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
	addScrapeContacts : function(res,collectionName,arr,callback){
		var promiseArr = [];
		fs.readFile('./domains.json' , function(err,data){
			if(err != null)
				callback(res,500);
			else{
				var domains = JSON.parse(data);
				for(var i=0; i<arr.length; i++){
					var matchFlag = false;
					for(var j=0;j<domains.length;j++){
						if(arr[i].email != null || arr[i].email != undefined){
							if( arr[i].email.indexOf(domains[j]) != -1 ){
								matchFlag = true;
								break;
							}
						}

					}
					if(matchFlag){
						promiseArr.push(dbHandler.dbInsert('blackList',arr[i]));
					}
					else
						promiseArr.push(dbHandler.dbInsert(collectionName,arr[i]));													
				}
				Promise.all(promiseArr)
				.then(function(results){
					callback(res,201);
				})
				.catch(function(error){
					callback(res,error);
				});
			}
		})
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
	removeField : function(collectionName,str){
		return new Promise(function(resolve,reject){
			var arr = [];
			dbHandler.dbQuery(collectionName,null)
			.then(function(results){
				console.log(results);
				for(var i=0;i<results.length;i++){
					var obj= results[i];
					delete obj[str];
					arr.push(obj);
				}
				return dbHandler.dbDropCollection(collectionName);
			})
			.then(function(results){
				console.log(arr);
				var promiseArr = [];
				for(var i=0;i<arr.length;i++){
					promiseArr.push(dbHandler.dbInsert(collectionName,arr[i]));
				}
				return Promise.all(promiseArr);
			})
			.then(function(results){
				resolve(200);
			})
			.catch(function(error){
				reject(500);
			});
		})	
	},
	addField : function(collectionName,str){
		return new Promise(function(resolve,reject){
			var arr = [];
			dbHandler.dbQuery(collectionName,null)
			.then(function(results){
				console.log(results);
				for(var i=0;i<results.length;i++){
					var obj= results[i];
					if(obj[str] == undefined)
						obj[str] = null;
					arr.push(obj);
				}
				console.log(arr);
				return dbHandler.dbDropCollection(collectionName);
			})
			.then(function(results){
				var promiseArr = [];
				for(var i=0;i<arr.length;i++){
					promiseArr.push(dbHandler.dbInsert(collectionName,arr[i]));
				}
				return Promise.all(promiseArr);
			})
			.then(function(results){
				resolve(200);
			})
			.catch(function(error){
				reject(500);
			});
		})
	},
	addDomainChain : function(collectionName,str){
		return new Promise(function(resolve,reject){ 
			var leadsArr = [];
			dbHandler.dbQuery(collectionName,null)
			.then(function(results){
				for(var i=0;i<results.length;i++){
					var emailAddr = results[i].email;
					if(emailAddr != null || emailAddr != undefined){
						if(emailAddr.indexOf(str) != -1){
							leadsArr.push(results[i]);
						}
					}	
				}
				var promiseArr = [];
				for(var i=0;i<leadsArr.length;i++){
					console.log(leadsArr[i]);
					promiseArr.push(dbHandler.dbDelete(collectionName,leadsArr[i]));
				}
				return Promise.all(promiseArr);
			})
			.then(function(results){
				var promiseArr = [];
				for(var i=0;i<leadsArr.length;i++){
					delete leadsArr[i]._id;
					promiseArr.push(dbHandler.dbInsert('blackList',leadsArr[i]));
				}
				return Promise.all(promiseArr);
			})
			.then(function(results){
				resolve(200);
			})
			.catch(function(error){
				reject(500);
			})
		});
	}
/*	
	removeDomainChain : function(collectionName,str){
		return new Promise(function(resolve,reject){
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
				resolve(200);
			})
			.catch(function(error){
				reject(500);
			});
		})
	}
*/

};

module.exports = ContactsManager;