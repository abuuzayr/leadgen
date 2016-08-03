var dbHandler = require('../database-handler'),
	config = require('../config'),
	common = require('../common'),
	mongodb = require('mongodb'),
	contactsHandler = require('../ContactsManager/contacts-manager'),
	Promise = require('bluebird');
var _ = require('lodash');

/**
*Module to handle mailinglists database calls for bulletleads
*@exports mailinglistmanager
*/

var MailinglistManager = {
	 /**
      *Retrieves mailing members from the MongoDB
      *@param {string} collectionName - the database table the mailinglist information belongs in
      *@param {Object} obj - the object that contains the ID of the mailinglist
      *@returns {Promise} returns results or error
      */
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
	 /**
      *Edit member's information in mailinglist
      *@param {string} collectionName - the database table the mailinglist information belongs in
      *@param {string} lname - the last name field of the contact
      *@param {string} fname - the first name name field of the contact
      *@param {string} lID - the ID of the mailinglist the contact belongs to
      *@param {string} sHash - the md5 hash of the email address of the contact
      *@returns {Promise} returns results or error
      */
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
	 /**
      *Create a new mailing in bullet leads
      *@param {object} res - result status of the creation
      *@param {string} collectionName - the table name where the mailing lists are stored(CompanyID specific)
      *@param {object} obj - the name of the mailing list.
      *@param {Method} callback - call back method to return the results to front end
      *@returns {Method} returns results using callback
      */
	addList: function(res, collectionName, obj, callback) {
		dbHandler.dbInsert(collectionName, obj)
			.then(function(results) {
				callback(res, 200);
			})
			.catch(function(error) {
				callback(res, 500);
			});
	},
	/**
      *Create a new mailing in bullet leads (Used when syncing with mailchimp)
      *@param {string} collectionName - the table name where the mailing lists are stored(CompanyID specific)
      *@param {object} obj - the name of the mailing list.
      *@returns {Promise} returns results or error
      */
	addListMC: function(collectionName, obj) {
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
	/**
      *Create a contact in leads table, using the _id and add the contact into mailinglists table 
      *@param {string} collectionName - the table name where the mailing lists are stored(CompanyID specific)
      *@param {object} obj - the object that contains the contact's information.
      *@param {string} apiKey - the company's specific mailchimp api key
      *@param {string} coId - the ID that identifies a particular company
      *@param {string} coName - the name that identifies a particular company
      *@returns {Promise} returns results or error
      */
	addContactsChain: function(collectionName, obj, apiKey, coId, coName) {
		return new Promise(function(resolve, reject) {
			/*console.log('++++++++++++ADDCONTACTSCHAIN+++++++++++++');	*/
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
			var filterObj = {};
			filterObj.listID = obj.listID;
			filterObj.email_hash = obj.email_hash;

			dbHandler.dbQuery(collectionName, filterObj)
				.then(function(results)
				{
					if(results.length==0)
					{
						var filterObj2 = {};
						filterObj2.lastName=obj.firstName
						filterObj2.firstName=obj.lastName
						filterObj2.email = obj.email_addr;
						console.log(coId+"_leads");
						console.log(filterObj2);
						dbHandler.dbQuery(coId+"_leads", filterObj2)
						.then(function(leadsResults)
						{
							if(leadsResults.length==0)
							{
								//contacts dont have this data, hence we add new contact
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
									dbHandler.dbInsert(collectionName, tempML)
										.then(function(result) {
											resolve(result);
										}).catch(function(MLerror) {
											reject(MLerror);
										});
								})
								.catch(function(error2) {
									reject(error2);
								});
							}else
							{
									var tempML = {
										contactID: leadsResults._id + '',
										listID: obj.listID,
										name: obj.name,
										email_addr: obj.email_addr,
										email_hash: obj.email_hash,
										firstName: obj.firstName,
										lastName: obj.lastName,
										subscriberStatus: obj.subscriberStatus
									};
									dbHandler.dbInsert(collectionName, tempML)
										.then(function(result) {
											resolve(result);
										}).catch(function(MLerror) {
											reject(MLerror);
										});
							}
						
						})
						.catch(function(error)
						{
							console.log(error);
							reject(500);
						});
					}

				})
				.catch(function(error1)
				{
					console.log(error1);
					reject(500);
				})
		});
	},
	/**
      *Delete mailinglists from bullet leads
      *@param {string} res - the results status that will be return to the front end
      *@param {string} collectionName - the table name where the mailing lists are stored(CompanyID specific)
      *@param {object} obj - the object that contains the mailinglist's information.
      *@returns {method} callback - callback method to return the status to the front end
      */
	deleteList: function(res, collectionName, obj, callback) {
		dbHandler.deleteManyDB(collectionName, obj)
			.then(function(results) {
				callback(res, 200);
			})
			.catch(function(error) {
				callback(res, error);
			});
	},
	/**
      *Delete mailinglists from bullet leads
      *@param {string} collectionName - the table name where the mailing lists are stored(CompanyID specific)
      *@param {object} obj - the object that contains the mailing list's information.
      *@returns {Promise} returns results or error
      */
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
	/**
      *Retrieve a list of mailinglist names from bullet leads server
      *@param {string} res - the results that will be return to the front end
      *@param {string} collectionName - the table name where the mailing lists are stored(CompanyID specific)
      *@returns {method} callback - callback method to return the results to the front end
      */
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
	/**
      *Edit the contact information saved in mailing list table
      *@param {string} collectionName - the table name where the mailing lists are stored(CompanyID specific)
      *@param {object} obj - the object that contains the mailing list's information.
      *@param {string} coId - the ID of the company that owns the account
      *@returns {Promise} returns results or error
      */
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
							dbHandler.dbUpdateMany((coId+'_leads'), temp2[0], temp2[1])
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
	/**
      *Retrieves all mailing list name stored in the company's database
      *@param {string} collectionName - the table name where the mailing lists are stored(CompanyID specific)
      *@returns {Promise} returns results or error
      */
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
	/**
      *Retrieves all mailing list members stored in the company's database
      *@param {string} collectionName - the table name where the mailing lists are stored(CompanyID specific)
      *@returns {Promise} returns results or error
      */	
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
	/**
      *Adds members to the mailing list table
      *@param {string} res - the result status to be returned to the front end
      *@param {string} collectionName - the table name where the member's information are stored(CompanyID specific)
      *@param {Object} obj - an object that contains the information of the member.
      *@returns {method} returns results or error status
      */		
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
	/**
      *Adds members to the mailing list table
      *@param {string} res - the result status to be returned to the front end
      *@param {string} collectionName - the table name where the member's information are stored(CompanyID specific)
      *@param {Object} obj - an object that contains the information of the member.
      *@returns {method} returns results or error status
      */		
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
	/**
      *Edits the name of the mailing list in the database
      *@param {string} res - the result status to be returned to the front end
      *@param {string} collectionName - the table name where the member's information are stored(CompanyID specific)
      *@param {Array} obj - an object that contains the information of the mailinglist.
      *@returns {method} returns results or error status
      */
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
	/**
      *Retrieve all members that belongs to a specific mailing list in the database
      *@param {string} res - the results to be returned to the front end
      *@param {string} collectionName - the table name where the member's information are stored(CompanyID specific)
      *@param {Array} obj - an object that contains the information of the mailinglist.
      *@param {method} callback - the method use to return the results to the front end.
      *@param {string} coId - the ID of the company that owns the account
      *@returns {method} returns results or error 
      */
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
					pArr.push(dbHandler.getSubscriberContact((coId+'_leads'), queryID));
				}
				Promise.all(pArr)
					.then(function(promiseResults) {
						var finalResults = [];
						for (var i = 0; i < returnResults.length; i++) {
							for (var j = 0; j < promiseResults.length; j++) {
								var itemID = promiseResults[j][0]._id + '';
								if (_.isEqual(returnResults[i].contactID, itemID)) {
									var temp = Object.assign(returnResults[i], promiseResults[j][0]);
									if (temp.subscriberStatus === 'subscribed')
										temp.status = 1;
									else if (temp.subscriberStatus === 'unsubscribed')
										temp.status = 2;
									else if (temp.subscriberStatus === 'cleaned')
										temp.status = 3;
									else if (temp.subscriberStatus === 'pending')
										temp.status = 4;
									finalResults.push(temp);
								}
							}
						}
						callback(res, finalResults);
					}).catch(function(pAllError) {
						callback(res,pAllError);
					});
			})
			.catch(function(error) {
				callback(res, error);
			});
	},
	/**
      *Edits the name of the mailing list in the database
      *@param {string} collectionName - the table name where the member's information are stored(CompanyID specific)
      *@param {Array} obj - an object that contains the information of the mailinglist.
      *@returns {Promise} returns results or error status
      */
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
	/**
      *Removes a member from the mailing list database
      *@param {string} res - the results to be returned to the front end
      *@param {string} collectionName - the table name where the member's information are stored(CompanyID specific)
      *@param {Array} obj - an object that contains the information of the members.
      *@param {method} callback - a method to return the results to the front end
      *@returns {method} returns results or error status
      */
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
	/**
      *Removes a member from the mailing list database
      *@param {string} collectionName - the table name where the member's information are stored(CompanyID specific)
      *@param {Array} obj - an object that contains the information of the members.
      *@returns {Promise} returns results or error status
      */
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
	/**
      *Retrieves all information in mailing list.
      *@param {string} collectionName - the table name where the member's information are stored(CompanyID specific)
      *@returns {Promise} returns results or error status
      */
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
	/**
      *Updates the email activity for a specific contact
      *@param {string} collectionName - the table name where the member's information are stored(CompanyID specific)
      *@param {object} obj - object that contains the email activity for a particular contact
      *@returns {Promise} returns results or error status
      */
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
	/**
      *Filter out any duplicate item in the array
      *@param {string} collectionName - the table name where the member's information are stored(CompanyID specific)
      *@param {object} para - the ID of the mailingist to be retrieved.
      *@returns {Promise} - returns results or error status
      */
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
