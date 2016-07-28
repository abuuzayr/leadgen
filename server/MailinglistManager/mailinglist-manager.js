var dbHandler = require('../database-handler'),
	config = require('../config'),
	common = require('../common'),
	mongodb = require('mongodb'),
	contactsHandler = require('../ContactsManager/contacts-manager'),
	Promise = require('bluebird');

var _ = require('lodash');

var MailinglistManager = {
	getMailingListMemberInfo: function(collectionName, obj) {
		return new Promise(function(resolve, reject) {
			dbHandler.dbQuery(collectionName, obj)
				.then(function(results) {
					resolve(results);
				})
				.catch(function(error) {
					reject(error);
				});
		});
	},
	updateMemberInfo: function(collectionName, lname, fname, lID, sHash) {
		return new Promise(function(resolve, reject) {
			var object1 = {
				listID: lID,
				email_hash: sHash
			};
			var object2 = {
				firstName: fname,
				lastName: lname
			};
			dbHandler.dbUpdate(collectionName, object1, object2)
				.then(function(results) {
					resolve(results);
				})
				.catch(function(error) {
					reject(error);
				});
		});
	},
	addList: function(res, collectionName, obj, callback) {
		//create new Mailing List Object
		//define new object with MCadd results
		dbHandler.dbInsert(collectionName, obj)
			.then(function(results) {
				callback(res, 200);
			})
			.catch(function(error) {
				callback(res, 500);
			});
	},
	addListMC: function(collectionName, obj) {
		return new Promise(function(resolve, reject) {
			//create new Mailing List Object
			//define new object with MCadd results
			dbHandler.dbInsert(collectionName, obj)
				.then(function(results) {
					resolve(results);
				})
				.catch(function(error) {
					reject(error);
				});
		});
	},
	addContactsChain: function(collectionName, obj, apiKey, coId, coName) {
		return new Promise(function(resolve, reject) {
			console.log('++++++++++++ADDCONTACTSCHAIN+++++++++++++');	
			console.log(coId);
			var temp = {
				firstName: obj.firstName,
				lastName: obj.lastName,
				email: obj.email_addr,
				company: null,
				success: 0,
				failure: 0,
				history: null,
				type: 2,
				category: null,
				origin: 1,
				phone: null,
				source: coName
			};
			contactsHandler.addContactMC(temp, obj.email_hash, obj.listID, apiKey, coId)
				.then(function(results) {
					var tempML = {
						contactID: results + '',
						listID: obj.listID,
						name: obj.name,
						email_addr: obj.email_addr,
						email_hash: obj.email_hash,
						firstName: obj.firstName,
						lastName: obj.lastName,
						subscriberStatus: obj.subscriberStatus
					};
					console.log("Adding to mailing list");
					console.log(tempML);
					console.log(collectionName);
					dbHandler.dbInsert(collectionName, tempML)
						.then(function(result) {
							console.log("can add");
							resolve(result);
						}).catch(function(MLerror) {
							console.log("cannot add");
							reject(MLerror);
						});
				})
				.catch(function(error) {
					reject(error);
				});
		});
	},
	deleteList: function(res, collectionName, obj, callback) {
		dbHandler.deleteManyDB(collectionName, obj)
			.then(function(results) {
				callback(res, 200);
			})
			.catch(function(error) {
				callback(res, error);
			});
	},
	deleteListv2: function(collectionName, obj) {
		return new Promise(function(resolve, reject) {
			dbHandler.deleteManyDB(collectionName, obj)
				.then(function(results) {
					resolve(results);
				})
				.catch(function(error) {
					reject(error);
				});
		});
	},
	getListNames: function(res, collectionName, callback) {
		//This is to allow us to filter out mailing list names only.
		var obj = {
			email_hash: '-',
			email_addr: '-'
		};
		var returnResults = [];
		dbHandler.dbQuery(collectionName, obj)
			.then(function(results) {
				for (var i = 0; i < results.length; i++) {
					var temp = {
						listID: results[i].listID,
						name: results[i].name,
						subscribers: ''
					};
					returnResults.push(temp);
				}
				dbHandler.dbAggreateML(collectionName)
					.then(function(resultsA) {
						for (var i = 0; i < resultsA.length; i++) {
							for (var j = 0; j < returnResults.length; j++) {
								if (resultsA[i]._id == returnResults[j].listID) {
									returnResults[j].subscribers = resultsA[i].count - 1;
								}
							}
						}
						callback(res, returnResults);
					});
			})
			.catch(function(error) {
				reject(error);
			});
	},
	updateContactMC: function(collectionName, obj, coId) {
		return new Promise(function(resolve, reject) {
			//This is to allow us to filter out mailing list names only.
			dbHandler.dbQuery(collectionName, obj[0])
				.then(function(results) {
					var temp = [{
						listID: obj[0].listID,
						contactID: results[0].contactID,
						email_hash: obj[0].email_hash
					}, {
						firstName: obj[1].firstName,
						lastName: obj[1].lastName,
						subscriberStatus: obj[1].subscriberStatus
					}];
					var temp3 = [{
						contactID: results[0].contactID
					}, {
						firstName: obj[1].firstName,
						lastName: obj[1].lastName
					}];
					dbHandler.dbUpdateMany(collectionName, temp[0], temp[1])
						.then(function(results1) {
							var temp2 = [{
								_id: new mongodb.ObjectID(results[0].contactID)
							}, {
								firstName: obj[1].firstName,
								lastName: obj[1].lastName
							}];
							dbHandler.dbUpdateMany((coId+' leads'), temp2[0], temp2[1])
								.then(function(results2) {
									resolve(results2);
								})
								.catch(function(error3) {
									reject(error2);
								});
						}).catch(function(error2) {
							reject(error2);
						});
				})
				.catch(function(error) {
					reject(error);
				});
		});
	},
	getListNamesMC: function(collectionName) {
		//This is to allow us to filter out mailing list names only.
		return new Promise(function(resolve, reject) {
			var obj = {
				email_hash: '-',
				email_addr: '-'
			};
			dbHandler.dbQuery(collectionName, obj)
				.then(function(results) {
					resolve(results);
				})
				.catch(function(error) {
					reject(error);
				});
		});
	},
	getAllMembers: function(collectionName) {
		return new Promise(function(resolve, reject) {
			dbHandler.dbQuery(collectionName, null)
				.then(function(results) {
					resolve(results);
				})
				.catch(function(error) {
					reject(error);
				});
		});
	},
	populate: function(obj, collectionName) {
		//This is to allow us to filter out mailing list names only.
		if (!Array.isArray(obj)) {
			dbHandler.dbInsert(collectionName, obj)
				.then(function(results) {
					resolve(results);
				})
				.catch(function(error) {
					reject(error);
				});
		} else {
			var arr = [];
			for (var index in obj) {
				arr.push(dbHandler.dbInsert(collectionName, obj[index]));
			}
			Promise.all(arr)
				.then(function(results) {
					resolve(results);
				})
				.catch(function(error) {
					resolve(error);
				});
		}
	},
	addMemberToList: function(res, collectionName, obj, callback) {
		if (!Array.isArray(obj)) {
			dbHandler.dbInsert(collectionName, obj)
				.then(function(results) {
					callback(res, 200);
				})
				.catch(function(error) {
					callback(res, 500);
				});
		} else {
			var arr = [];
			for (var index in obj) {
				arr.push(dbHandler.dbInsert(collectionName, obj[index]));
			}
			Promise.all(arr)
				.then(function(results) {
					callback(res, 200);
				})
				.catch(function(error) {
					callback(res, 500);
				});
		}
	},
	addMemberToListMC: function(collectionName, obj) {
		return new Promise(function(resolve, reject) {
			dbHandler.dbInsert(collectionName, obj)
				.then(function(results) {
					resolve(results);
				})
				.catch(function(error) {
					reject(error);
				});
		});
	},
	dbDropCollection: function(res, collectionName, callback) {
		dbHandler.dbDropCollection(collectionName)
			.then(function(results) {
				callback(res, 200);
			})
			.catch(function(error) {
				callback(res, 500);
			});
	},
	updateList: function(res, collectionName, obj, callback) {
		if ((Array.isArray(obj)) && obj.length == 2) {
			dbHandler.dbUpdateMany(collectionName, obj[0], obj[1])
				.then(function(results) {
					callback(res, 200);
				})
				.catch(function(error) {
					callback(res, 500);
				});
		} else {
			callback(res, 400);
		}
	},
	getSubscribers: function(res, collectionName, obj, callback, coId) {
		var temp = {
			listID: obj.listID
		};
		dbHandler.dbQuery(collectionName, temp)
			.then(function(results) {
				console.log(results);
				var returnResults = [];
				for (var i = 0; i < results.length; i++) {
					if (results[i].email_hash != '-') {
						returnResults.push(results[i]);
					}
				}
				var pArr = [];
				for (var i = 0; i < returnResults.length; i++) {
					var queryID = {
						_id: returnResults[i].contactID
					};
					pArr.push(dbHandler.getSubscriberContact((coId+' leads'), queryID));
				}
				Promise.all(pArr)
					.then(function(promiseResults) {
						//console.log(promiseResults);
						var finalResults = [];
						for (var i = 0; i < returnResults.length; i++) {
							for (var j = 0; j < promiseResults.length; j++) {
								var itemID = promiseResults[j][0]._id + '';
								if (_.isEqual(returnResults[i].contactID, itemID)) {
									var temp = Object.assign(returnResults[i], promiseResults[j][0]);
									if (temp.subscriberStatus === 'subscribed')
										temp.status = 1;
									else
										temp.status = 2;
									finalResults.push(temp);
								}
							}
						}
						//console.log(finalResults);
						callback(res, finalResults);
					}).catch(function(pAllError) {
						callback(res,pAllError);
					});
			})
			.catch(function(error) {
				callback(res, error);
			});
	},
	updateListMC: function(collectionName, obj) {
		return new Promise(function(resolve, reject) {
			if ((Array.isArray(obj)) && obj.length == 2) {
				dbHandler.dbUpdateMany(collectionName, obj[0], obj[1])
					.then(function(results) {
						resolve(results);
					})
					.catch(function(error) {
						reject(error);
					});
			}
		});
	},
	deleteMember: function(res, collectionName, obj, callback) {
		if (!Array.isArray(obj)) {
			dbHandler.dbDelete(collectionName, obj)
				.then(function(results) {
					callback(res, results);
				})
				.catch(function(error) {
					callback(res, error);
				});
		} else {
			var arr = [];
			for (var index in obj) {
				arr.push(dbHandler.dbDelete(collectionName, obj[index]));
			}
			Promise.all(arr)
				.then(function(results) {
					callback(res, 200);
				})
				.catch(function(error) {
					callback(res, 500);
				});
		}
	},
	deleteMemberMC: function(collectionName, obj) {
		return new Promise(function(resolve, reject) {
			dbHandler.dbDelete(collectionName, obj)
				.then(function(results) {
					resolve(results);
				})
				.catch(function(error) {
					reject(error);
				});
		});
	},
	addReportActivity: function(collectionName, obj) {
		return new Promise(function(resolve, reject) {
			var queryTemp = {
				listID: obj.listID,
				email_hash: obj.email_hash
			};
			dbHandler.dbQuery(collectionName, queryTemp)
				.then(function(results) { //containing contactid
					obj.contactID = results[0].contactID;
					resolve(obj);
				})
				.catch(function(error) {
					reject(error);
				});
		});
	},
	getAllData: function(collectionName) {
		return new Promise(function(resolve, reject) {
			dbHandler.dbQuery(collectionName, null)
				.then(function(results) { //containing contactid
					resolve(results);
				})
				.catch(function(error) {
					reject(error);
				});
		});
	},
	updateActivity: function(collectionName, obj) {
		return new Promise(function(resolve, reject) {
			var obj1 = [{
				_id: obj._id
			}, {
				history: obj.history,
				success: obj.success,
				failure: obj.failure
			}];
			dbHandler.dbUpdateMany(collectionName, obj1[0], obj1[1])
				.then(function(results) {
					resolve(results);
				})
				.catch(function(error) {
					reject(error);
				});
		});
	},
	getFilterMembers: function(collectionName, para,results)
	{
		return new Promise (function(resolve,reject) {
		var obj={
			listID:para
		};
		dbHandler.dbQuery(collectionName,obj)
		.then(function(queryResults){//containing contactid
			var filterArr=[];
			var duplicateFound=false;
			for(var j=0;j<results.length;j++){
				for(var i=0;i<queryResults.length;i++){
						if(queryResults[i].email_hash==results[j].email_hash){
							 duplicateFound = true;
						}
				}
				if(duplicateFound==false) {
					filterArr.push(results[j]);
				}else {
					duplicateFound=false;
				}
			}
			var finalArray=_.uniq(filterArr);
			resolve(finalArray);
		})
		.catch(function(error){
			reject(error);
		});
		});
	}
};
module.exports = MailinglistManager;
