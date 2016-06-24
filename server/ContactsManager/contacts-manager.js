var dbHandler = require('../database-handler'),
config = require('../config'),
common = require('../common'),
fs = require('fs'),
mongodb = require('mongodb'),
Promise = require('bluebird');

var ContactsManager = {
	displayContacts : function(obj){
		return new Promise(function(resolve,reject){
			var arr = [];
			dbHandler.dbQuery('localCorporate',obj)
			.then(function(results){
				arr = results;
				return dbHandler.dbQuery('localConsumer',obj)
			})
			.then(function(results){
				for(var i=0;i<results.length;i++){
					arr.push(results[i]);
				}
				resolve(arr);
			})
			.catch(function(error){
				reject(500);
			});	
		});
	},
	addContacts : function(obj){
		return new Promise(function(resolve,reject){
			if(obj.type != 1 && obj.type!=2)
				reject(400);
			else{
				if(obj.origin != 1)
					obj.origin = 1;
				if(obj.type ==1){
					dbHandler.dbInsert('localCorporate',obj)
					.then(function(results){
						resolve(results);
					})
					.catch(function(error){
						reject(error);
					});
				}
				else{
					dbHandler.dbInsert('localConsumer',obj)
					.then(function(results){
						resolve(results);
					})
					.catch(function(error){
						reject(error);
					});
				}

			}

		})

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
	deleteContacts : function(obj){
		return new Promise(function(resolve,reject){
			if(!Array.isArray(obj)){
				if(obj.type != 1 && obj.type != 2)
					reject(400);
				else{

					if(obj.type == 1){
						dbHandler.dbDelete('localCorporate',obj)
						.then(function(results){
							resolve(results);
						})
						.catch(function(error){
							reject(error);
						});						
					}else{
						dbHandler.dbDelete('localConsumer',obj)
						.then(function(results){
							resolve(results);
						})
						.catch(function(error){
							reject(error);
						});						
					}	

				}	
			}else{
				var arr = [];
				for(var index in obj){
					var item = obj[index];
					if(item.type != 1 && item.type != 2)
						reject(400);
					else{
						if(item.type == 1){
							arr.push(dbHandler.dbDelete('localCorporate',item));		
						}else{
							arr.push(dbHandler.dbDelete('localConsumer',item));				
						}	
					}
				}
				Promise.all(arr)
				.then(function(results){
					resolve(200);
				})
				.catch(function(error){
					reject(error);
				})
			}
		});	

	},
	updateContacts : function(obj){
		return new Promise(function(resolve,reject){
			if((Array.isArray(obj)) && obj.length == 2){
				var type = obj[0].type;
				
				if(obj[0].origin == 2)
					obj[1].origin = 1;

				if(type != 1 && type != 2)
					reject(400);
				
				else{
					if(type == 1){
						dbHandler.dbUpdate('localCorporate',obj[0],obj[1])
						.then(function(results){
							resolve(results);
						})
						.catch(function(error){
							reject(error);
						});
					}else{
						dbHandler.dbUpdate('localConsumer',obj[0],obj[1])
						.then(function(results){
							resolve(results);
						})
						.catch(function(error){
							reject(error);
						});						
					}

				}
			}else{
				reject(400);
			}
		})
	},
	removeField : function(collectionName,str){
		return new Promise(function(resolve,reject){
			var arr = [];
			dbHandler.dbQuery(collectionName,null)
			.then(function(results){
				if (results.length == 0)
					resolve(200);
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
				if(results.length == 0){
					resolve(200);
				}
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