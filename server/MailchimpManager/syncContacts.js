var mailchimpClass = require('./mailchimpApp');
var mailinglistmanager = require('../MailinglistManager/mailinglist-manager');
var Promise = require('bluebird');
var dbHandler = require('../database-handler'),
    config = require('../config'),
    common = require('../common'),
    mongodb = require('mongodb');

/**
*Module to handle mailchimp services and bulletleads calls
*Performs the syncing of two data
*@exports MailchimpManager
*/

var mailchimpHandler = {
    /**
      *Syncs bullet leads database (per company) with mailchimp server
      *@param {string} apiKey - apikey of the user's mailchimp account
      *@param {string} coId - the ID of the company that owns the mailchimp account.
      *@param {string} coName - the name of the company that owns the mailchimp account.
      *@returns {Promise} returns success or error
      */
    syncContacts: function(apiKey, coId, coName) {
        return new Promise(function(resolve, reject) {
            /**
            *Check if the account is eligible to launch a sync request
            */
            checkSyncEligibility(coId)
                .then(function(checkSyncEligibilityResult)
                {
                    if(checkSyncEligibilityResult){
                        /**
                        *Someone else is syncing, skip the step.
                        */
                        //console.log("Sync has already started");
                        resolve('true');
                    }else{
                        mailchimpClass.getMyList(apiKey)
                            .then(function(results) {
                    var mailchimplist;
                    var appDatabase;
                    /**
                    *Retrieve members from mailchimp server
                    */
                    mailchimplist = results;
                    mailinglistmanager.getListNamesMC(coId + '_mailinglists')
                        .then(function(dbResults) {
                            var databaselist = [];
                            //create object with a array of list information.
                            for (var i = 0; i < dbResults.length; i++) {
                                var temp = {
                                    name: dbResults[i].name,
                                    listID: dbResults[i].listID,
                                    members: []
                                };
                                databaselist.push(temp);
                            }
                            /**
                            *Retrieve members from bulletleads server
                            */
                            mailinglistmanager.getAllMembers(coId + '_mailinglists')
                                .then(function(dbResults2) {
                                    //poplating the members field
                                    for (var i = 0; i < dbResults2.length; i++) {
                                        if (dbResults2[i].email_addr != '-') {
                                            var listID = dbResults2[i].listID;
                                            var member = {
                                                email_hash: dbResults2[i].email_hash,
                                                email_addr: dbResults2[i].email_addr,
                                                subscriberStatus: dbResults2[i].subscriberStatus,
                                                firstName: dbResults2[i].firstName,
                                                lastName: dbResults2[i].lastName
                                            };
                                            for (var j = 0; j < databaselist.length; j++) {
                                                if (databaselist[j].listID == listID) {
                                                    databaselist[j].members.push(member);
                                                }
                                            }
                                        }
                                    }
                                    return databaselist;
                                }).then(function(databaselist) {
                                    /**
                                    *Below console logs are to aid debugging.
                                    *It prints the both lists retrieved from the two servers
                                    */
                                    /*console.log("====================App Database ========================================");
                                    for (var i = 0; i < databaselist.length; i++) {
                                        console.log(databaselist[i]);
                                    }
                                    console.log("====================mailchimp Database ========================================");
                                    for (var i = 0; i < mailchimplist.length; i++) {
                                        console.log(mailchimplist[i]);
                                    }
                                    console.log("mailinglist has " + mailchimplist.length);
                                    console.log("databaselist has " + databaselist.length);
                                    */
                                    var returnArr = [];
                                    returnArr.push(mailchimplist);
                                    returnArr.push(databaselist);
                                    return returnArr;
                                }).then(function(returnArr) {
                                    return returnArr;
                                })
                                .then(function(returnArr) {
                                    /**
                                    *Now that we have both results, we compare them to see if there are the same
                                    *First, we need to identify a unique list that exists at both server
                                    *From this, we can compare the contents individually and apply the difference to bulletleads server.
                                    */ 
                                    // this is detect and record down any difference found while comparing the two array
                                    var differenceArr = [];
                                    var mailchimplist = returnArr[0];
                                    var appDatabase = returnArr[1];
                                    var i, j;
                                    for (i = 0; i < mailchimplist.length; i++) {
                                        var listfound = false;
                                        for (j = 0; j < appDatabase.length; j++) {
                                            if (appDatabase[j].listID == mailchimplist[i].listID) {
                                                listfound = true; //we've found the same list!
                                                var temp = {
                                                    name: mailchimplist[i].name,
                                                    listID: mailchimplist[i].listID,
                                                    members: [],
                                                    action: '0' // 0 - default, 1 - update list name only, 2- update members info only, 3 update both member and list name
                                                };
                                                //check if their name is still the same
                                                if (appDatabase[j].name != mailchimplist[i].name) {
                                                    //user has changed the name of the list a mailchimp side!
                                                    temp.action = '1';
                                                }
                                                var membTemp = []; // Array of objects
                                                membTemp = compareMemberLists(mailchimplist[i].members, appDatabase[j].members);
                                                //1 - update member, 2- create member, 3 delete remove
                                                if (membTemp.length != '0') {
                                                    if (temp.action == '1') {
                                                        temp.action = '3';
                                                    } else {
                                                        temp.action = '2';
                                                    }
                                                    temp.members = membTemp;
                                                }
                                                if (temp.action != '0') {
                                                    differenceArr.push(temp);
                                                }
                                            }
                                        } //check if users has created lists in mailchimp side!
                                        if (listfound === false) {
                                            var tempt = {
                                                name: mailchimplist[i].name,
                                                listID: mailchimplist[i].listID,
                                                members: mailchimplist[i].members,
                                                action: '4' //to denote an create
                                            };
                                            differenceArr.push(tempt);
                                        }
                                    }
                                    //now to detect if the user deletes on the mailchimp side
                                    for (i = 0; i < appDatabase.length; i++) {
                                        var listfound = false;
                                        for (j = 0; j < mailchimplist.length; j++) {
                                            if (appDatabase[i].listID == mailchimplist[j].listID) {
                                                listfound = true;
                                            }
                                        }
                                        if (!listfound) {
                                            //if not found, it means that user has deleted the list on the mailchimp server
                                            //we will attempt to remove from our side as well.
                                            var tempt = {
                                                name: appDatabase[i].name,
                                                listID: appDatabase[i].listID,
                                                members: appDatabase[i].members,
                                                action: '5' //to denote an delete
                                            };
                                            differenceArr.push(tempt);
                                        }
                                    }
                                    return differenceArr;
                                }).then(function(differenceArr) {
                                    /** console.log("====================Update Database ========================================");
                                     *for (var i = 0; i < differenceArr.length; i++) {
                                     *   console.log(differenceArr[i]);
                                     *}
                                     */
                                    /**Now that the difference of the two arrays has been arranged
                                     *
                                     */
                                    var promiseArr = [];
                                    for (var i = 0; i < differenceArr.length; i++) {
                                        //go through everylist check the action, perform the action.
                                        if (differenceArr[i].action == '5') {
                                            //start delete call
                                            var deleteListTemp = {
                                                listID: differenceArr[i].listID,
                                                name: differenceArr[i].name
                                            };
                                            promiseArr.push(mailinglistmanager.deleteListv2((coId + '_mailinglists'), deleteListTemp));
                                        } else if (differenceArr[i].action == '4') {
                                            //its a create call
                                            //method call to create ML
                                            var createListTemp = {
                                                contactID: '-',
                                                listID: differenceArr[i].listID,
                                                name: differenceArr[i].name,
                                                email_addr: '-',
                                                email_hash: '-',
                                                firstName: '-',
                                                lastName: '-',
                                                subscriberStatus: '-'
                                                    //_id will be auto generated
                                            };
                                            promiseArr.push(mailinglistmanager.addListMC((coId + '_mailinglists'), createListTemp));
                                            if (differenceArr[i].members.length != '0') {
                                                for (var j = 0; j < differenceArr[i].members.length; j++) {
                                                    //add the member inside the
                                                    var createContactTemp = {
                                                        listID: differenceArr[i].listID,
                                                        name: differenceArr[i].name,
                                                        email_addr: differenceArr[i].members[j].email_addr,
                                                        email_hash: differenceArr[i].members[j].email_hash,
                                                        firstName: differenceArr[i].members[j].firstName,
                                                        lastName: differenceArr[i].members[j].lastName,
                                                        subscriberStatus: differenceArr[i].members[j].subscriberStatus
                                                    };
                                                    promiseArr.push(mailinglistmanager.addContactsChain((coId + '_mailinglists'), createContactTemp, apiKey, coId, coName));
                                                }
                                            }
                                        } else if (differenceArr[i].action == '3') {
                                            //update members and listname
                                            //include list method
                                            //loop members
                                            var updateListNameTemp = [{
                                                listID: differenceArr[i].listID
                                            }, {
                                                name: differenceArr[i].name
                                            }];
                                            promiseArr.push(mailinglistmanager.updateListMC((coId + '_mailinglists'), updateListNameTemp));
                                            for (var j = 0; j < differenceArr[i].members.length; j++) {
                                                //identify the type of update C/U/D
                                                if (differenceArr[i].members[j].action == '1') {
                                                    //update member
                                                    var updateListNameTemp = [{
                                                        listID: differenceArr[i].listID,
                                                        email_hash: differenceArr[i].members[j].email_hash
                                                    }, {
                                                        firstName: differenceArr[i].members[j].firstName,
                                                        lastName: differenceArr[i].members[j].lastName,
                                                        subscriberStatus: differenceArr[i].members[j].subscriberStatus
                                                    }];
                                                    promiseArr.push(mailinglistmanager.updateContactMC((coId + '_mailinglists'), updateListNameTemp, coId));
                                                } else if (differenceArr[i].members[j].action == '2') {
                                                    //create member
                                                    var createContactTemp = {
                                                        listID: differenceArr[i].listID,
                                                        name: differenceArr[i].name,
                                                        email_addr: differenceArr[i].members[j].email_addr,
                                                        email_hash: differenceArr[i].members[j].email_hash,
                                                        firstName: differenceArr[i].members[j].firstName,
                                                        lastName: differenceArr[i].members[j].lastName,
                                                        subscriberStatus: differenceArr[i].members[j].subscriberStatus
                                                    };
                                                    promiseArr.push(mailinglistmanager.addContactsChain((coId + '_mailinglists'), createContactTemp, apiKey, coId, coName));
                                                } else if (differenceArr[i].members[j].action == '3') {
                                                    //delete member
                                                    var deleteContactTemp = {
                                                        listID: differenceArr[i].listID,
                                                        name: differenceArr[i].name,
                                                        email_addr: differenceArr[i].members[j].email_addr,
                                                        email_hash: differenceArr[i].members[j].email_hash,
                                                        firstName: differenceArr[i].members[j].firstName,
                                                        lastName: differenceArr[i].members[j].lastName,
                                                        subscriberStatus: differenceArr[i].members[j].subscriberStatus
                                                    };
                                                    promiseArr.push(mailinglistmanager.deleteMemberMC((coId + '_mailinglists'), deleteContactTemp));
                                                }
                                            }
                                        } else if (differenceArr[i].action == '2') {
                                            //update members only
                                            for (var j = 0; j < differenceArr[i].members.length; j++) {
                                                if (differenceArr[i].members[j].action == '1') {
                                                    //update member
                                                    var updateListNameTemp = [{
                                                        listID: differenceArr[i].listID,
                                                        email_hash: differenceArr[i].members[j].email_hash
                                                    }, {
                                                        firstName: differenceArr[i].members[j].firstName,
                                                        lastName: differenceArr[i].members[j].lastName,
                                                        subscriberStatus: differenceArr[i].members[j].subscriberStatus
                                                    }];
                                                    promiseArr.push(mailinglistmanager.updateContactMC((coId + '_mailinglists'), updateListNameTemp, coId));
                                                } else if (differenceArr[i].members[j].action == '2') {
                                                    //create member
                                                    var createContactTemp = {
                                                        listID: differenceArr[i].listID,
                                                        name: differenceArr[i].name,
                                                        email_addr: differenceArr[i].members[j].email_addr,
                                                        email_hash: differenceArr[i].members[j].email_hash,
                                                        firstName: differenceArr[i].members[j].firstName,
                                                        lastName: differenceArr[i].members[j].lastName,
                                                        subscriberStatus: differenceArr[i].members[j].subscriberStatus
                                                    };
                                                    promiseArr.push(mailinglistmanager.addContactsChain((coId + '_mailinglists'), createContactTemp, apiKey, coId, coName));
                                                } else if (differenceArr[i].members[j].action == '3') {
                                                    //delete member
                                                    var deleteContactTemp = {
                                                        listID: differenceArr[i].listID,
                                                        name: differenceArr[i].name,
                                                        email_addr: differenceArr[i].members[j].email_addr,
                                                        email_hash: differenceArr[i].members[j].email_hash,
                                                        firstName: differenceArr[i].members[j].firstName,
                                                        lastName: differenceArr[i].members[j].lastName,
                                                        subscriberStatus: differenceArr[i].members[j].subscriberStatus
                                                    };
                                                    promiseArr.push(mailinglistmanager.deleteMemberMC((coId + '_mailinglists'), deleteContactTemp));
                                                }
                                            }
                                        } else if (differenceArr[i].action == '1') {
                                            //updatelistname only
                                            var updateListNameTemp = [{
                                                listID: differenceArr[i].listID
                                            }, {
                                                name: differenceArr[i].name
                                            }];
                                            promiseArr.push(mailinglistmanager.updateListMC((coId + '_mailinglists'), updateListNameTemp));
                                        }
                                    }
                                    Promise.all(promiseArr)
                                        .then(function(result) {
                                            console.log('We are done with sync');
                                            /**
                                            *Now that contacts has finish syncing, we can start to sync email activity.
                                            */
                                            mailchimpClass.getReports(getReportDetails, coId, resolve, reject, apiKey);
                                        })
                                        .catch(function(error2) {
                                            reject(error2);
                                        });
                                })
                                .catch(function(error) {
                                    reject(error);
                                })
                        });
                      });
                    }
                })
                .catch(function(syncEligibilityError)
                {
                    reject(syncEligibility);
                });
           });
    },
    /**
      *Edit the name of a mailing list in the mailchimp server
      *@param {string} apiKey - apikey of the user's mailchimp account
      *@param {string} listID - the ID of the mailinglist that will be updated in mailchimp server
      *@param {string} tempInfo - information of the mailinglist
      *@returns {Promise} returns success or error
      */
    updateList: function(apiKey, listID, tempInfo) {
        return new Promise(function(resolve, reject) {
            mailchimpClass.updateList(apiKey, listID, tempInfo)
                .then(function(results) {
                    resolve(results);
                }).catch(function(error) {
                    reject(error);
                });
        });
    },
    /**
      *Adds a mailing list name in the mailchimp server
      *@param {string} apiKey - apikey of the user's mailchimp account
      *@param {string} listName - the name of the new mailing list to be added to the mailchimp server
      *@returns {Promise} returns a success or error
      */
    addList: function(apiKey, listName) {
        return new Promise(function(resolve, reject) {
            mailchimpClass.addList(apiKey, listName)
                .then(function(results) {
                    resolve(results);
                }).catch(function(error) {
                    reject(error);
                });
        });

    },
     /**Add a new member to a specific list in mailchimp
      *@param {string} apiKey - apikey of the user's mailchimp account
      *@param {string} listID - the ID of the mailinglist used in mailchimp server
      *@param {object} memberInfo - an object that contains the details of the member to be added.
      *@returns {Promise} returns a success or error
      */
    addMemberToList: function(apiKey, listID, memberInfo) {
        return new Promise(function(resolve, reject) {
            mailchimpClass.addMemberToList(apiKey, listID, memberInfo)
                .then(function(results) {
                    resolve(results);
                })
                .catch(function(error) {
                    reject(error);
                });
        });
    },
    /**
      *Retrieves information of a specific mailinglist from mailchimp server
      *@param {string} apiKey - apikey of the user's mailchimp account
      *@param {string} listID - the ID of the mailinglist that will be retrieved in mailchimp server
      *@returns {Promise} returns the information of the mailinglist or error
      */
    getListInformation: function(apiKey, listID) {
        return new Promise(function(resolve, reject) {
            mailchimpClass.getListInformation(apiKey, listID)
                .then(function(results) {
                    resolve(results);
                }).catch(function(error) {
                    reject(error);
                });
        });
    },
    /**
      *Removes a member from a specific mailing list in mailchimp
      *@param {string} apiKey - apikey of the user's mailchimp account
      *@param {string} listID - the ID of the mailinglist that will be deleted in mailchimp server
      *@param {string} suscribeHash - the ID of the member in a specific mailinglist in mailchimp server (md5 of the email address)
      *@returns {Promise} returns a success or error
      */
    deleteMember: function(apiKey, listID, suscribeHash) {
        return new Promise(function(resolve, reject) {
            mailchimpClass.deleteMember(apiKey, listID, suscribeHash)
                .then(function(results) {
                    resolve(results);
                })
                .catch(function(error) {
                    reject(error);
                });
        });
    },
    /**
      *Removes a list from mailchimp server
      *@param {string} apiKey - apikey of the user's mailchimp account
      *@param {string} listID - the ID of the mailinglist that will be deleted in mailchimp server
      *@returns {Promise} returns a success or error
      */
    deleteList: function(apiKey, listID) {
        return new Promise(function(resolve, reject) {
            mailchimpClass.deleteList(apiKey, listID)
                .then(function(results) {
                    resolve(results);
                })
                .catch(function(error) {
                    reject(error);
                });
        });
    },
    /**
      *Edit the name of a mailing list in the mailchimp server
      *@param {string} apiKey - apikey of the user's mailchimp account
      *@param {string} listID - the ID of the mailinglist that will be updated in mailchimp server
      *@returns {Promise} returns success or error
      */
    updateMember: function(apiKey, listID, suscribeHash, memberInfo) {
        return new Promise(function(resolve, reject) {
            mailchimpClass.updateMember(apiKey, listID, suscribeHash, memberInfo)
                .then(function(results) {
                    resolve(results);
                }).catch(function(error) {
                    reject(error);
                });
        });
    }
};
module.exports = mailchimpHandler;

    /**
      *Edits the status of the account to denote if the company database is synching with the mailchimp server
      *@param {string} companyId - the ID of the company
      *@param {string} newStatus - the new status for the company
      *@returns {Promise} returns success or error
      */

var updateSyncStatus = function(companyId, newStatus){
     return new Promise(function(resolve, reject) {
        var obj={
            coId:companyId
        };
        var obj2={
            status:newStatus
        };
        dbHandler.dbUpdate("syncStatus", obj, obj2)
            .then(function(updateSyncStatus)
            {
                resolve(200);
            })
            .catch(function(updateSyncStatusError)
            {
                reject(500);
            })
     });
}
    /**
      *Method checks if the company account is currently syncing contacts
      *@param {string} companyId - the ID of the company
      *@returns {Promise} returns success or error
      */
var checkSyncEligibility = function(companyId){
     return new Promise(function(resolve, reject) {
        var obj={
            coId:companyId
        };
        dbHandler.dbQuery("syncStatus", obj)
            .then(function(results) {
                if(results.length==0){
                    //company didnt sync before
                    var obj2={
                        coId:companyId,
                        status: "true"
                    };
                    dbHandler.dbInsert("syncStatus", obj2)
                        .then(function(result)
                        {
                            resolve(false);
                        })
                        .catch(function(insertError)
                        {
                            reject(500);
                        })
                }else if(results[0].status=="true"){
                   //sync has already started
                    resolve(true);
                }else{
                    //sync has not started, we start it
                    updateSyncStatus("syncStatus", companyId, "true")
                        .then(function(updateSyncStatus)
                        {
                            resolve(false);
                        })
                        .catch(function(updateSyncSTatusError)
                        {
                            reject(500);
                        })

                }
            })
            .catch(function(error) {
                reject(error);
            });
        });
}
    /**
      *Method takes in the report information array from mailchimp, sort and save into bulletleads.
      *@param {string} apiKey - apikey of the user's mailchimp account
      *@param {string} listID - the ID of the mailinglist that will be updated in mailchimp server
      *@param {Promise} resolve - To allow method to resolve the results
      *@param {Promise} reject - To allow method to reject the promise if something fails
      *@returns {Promise} returns success or error
      */
}
var getReportDetails = function(results, coId, resolve, reject) {
    var activityArr = [];
    /**
     *console.log("===================Report activity ==============================");
     *console.log(results);
     */
    // retrieve activity information.
    //Now we want to collate all these information and save them into another array
    //mailing list ID and mc id will get us the contact id so we can add the relevant data.
    //if there are duplicate action and timestamp we add action else, dont add action
    for (var i = 0; i < results.length; i++) {
        for (var j = 0; j < results[i].emails.length; j++) {
            var temp = {
                listID: results[i].emails[j].list_id, //The unique id for the list.
                campid: results[i].campaign_id,
                email_addr: results[i].emails[j].email_address,
                email_hash: results[i].emails[j].email_id,
                action: results[i].emails[j].activity,
                //One of the following actions: ‘open’, ‘click’, or ‘bounce’ and the date and time recorded for the action.
                contactID: ''
            };
            if (results[i].emails[j].activity.length != 0) {
                activityArr.push(temp);
            }
        }
    }
    mailinglistmanager.getAllData(coId + '_mailinglists')
        .then(function(mlResults) {
            for (var i = 0; i < activityArr.length; i++) {
                for (var j = 0; j < mlResults.length; j++) {
                    if (activityArr[i].listID == mlResults[j].listID) {
                        if (activityArr[i].email_hash == mlResults[j].email_hash) {
                            activityArr[i].contactID = mlResults[j].contactID;
                        }
                    }
                }
            }
            mailinglistmanager.getAllData(coId + '_leads')
                .then(function(cResults) {
                    for (var j = 0; j < cResults.length; j++) {
                        cResults[j].history = [];
                    }
                    for (var i = 0; i < cResults.length; i++) {
                        var sCount = 0;
                        var fCount = 0;
                        var itemID = cResults[i]._id + '';
                        for (var j = 0; j < activityArr.length; j++) {
                            if (activityArr[j].contactID == itemID) {
                                var tempTime = activityArr[j].action[0].timestamp;
                                activityArr[j].action[0].timestamp = tempTime.substring(0, 10);
                                if (activityArr[j].action[0].action == 'bounce')
                                    fCount++;
                                else
                                    sCount++;
                                cResults[i].history.push(activityArr[j].action[0]);
                            }
                        }
                        cResults[i].success = sCount;
                        cResults[i].failure = fCount;
                    }
                    var promiseActivityArr = [];
                    for (var k = 0; k < cResults.length; k++) {
                        promiseActivityArr.push(mailinglistmanager.updateActivity((coId + '_leads'), cResults[k]));
                    }
                    Promise.each(activityArr)
                        .then(function(activityResults) {
                            resolve(activityResults);
                        })
                        .catch(function(activityError) {
                            reject(activityError);
                        });
                })
                .catch(function(cError) {
                    reject(cError);
                });
        }).catch(function(mlError) {
            reject(mlError);
        });
    console.log("End of Report activity");
    var obj={
        coId:coId
    };
    var obj2={
        status:"false"
    };
    updateSyncStatus("syncStatus", obj, obj2)
        .then(function(results)
        {
            resolve('true');
        })
        .catch(function()
        {
            reject(500);
        });
};

    /**
      *Method takes in two arrays, retrieved from mailchimp and bullet leads and returns the differences
      *@param {Array} mailchimpMembers - a list of mailing list members retrieved from mailchimp
      *@param {Array} membersDatabase - a list of mailing list members retrieved from bullet leads
      *@returns {Promise} returns success or error
      */
function compareMemberLists(mailchimpMembers, membersDatabase) {
    var differenceMemArr = [];
    for (var i = 0; i < mailchimpMembers.length; i++) {
        var memberFound = false;
        for (var j = 0; j < membersDatabase.length; j++) {
            if (membersDatabase[j].email_hash == mailchimpMembers[i].email_hash) {
                memberFound = true; //we've found the same list!
                var temp = {
                    // 0 - default, 1 - update member, 2- create member, 3 delete remove
                    email_hash: mailchimpMembers[i].email_hash,
                    email_addr: mailchimpMembers[i].email_addr,
                    subscriberStatus: mailchimpMembers[i].subscriberStatus,
                    firstName: mailchimpMembers[i].firstName,
                    lastName: mailchimpMembers[i].lastName,
                    action: '0'
                };
                //check if their name is still the same
                if (JSON.stringify(mailchimpMembers[i]) != JSON.stringify(membersDatabase[j])) {
                    //user has changed the name of the list a mailchimp side!
                    temp.action = '1'; // to denote member update at mailchimp side
                    differenceMemArr.push(temp);
                }
            }
        }
        if (!memberFound) {
            var temp = {
                // 0 - default, 1 - update member, 2- create member, 3 delete remove
                email_hash: mailchimpMembers[i].email_hash,
                email_addr: mailchimpMembers[i].email_addr,
                subscriberStatus: mailchimpMembers[i].subscriberStatus,
                firstName: mailchimpMembers[i].firstName,
                lastName: mailchimpMembers[i].lastName,
                action: '2'
            };
            var findDuplicate = false;
            for (var k = 0; k < differenceMemArr.length; k++) {
                if (differenceMemArr[k].email_hash == mailchimpMembers[i].email_hash) {
                    findDuplicate = true;
                }
            }
            if (findDuplicate == false) {
                differenceMemArr.push(temp);
            }
        }
    }
    //find deleted members
    for (var i = 0; i < membersDatabase.length; i++) {
        var memberFound = false;
        for (var j = 0; j < mailchimpMembers.length; j++) {
            //console.log(membersDatabase[i].email_hash +" "+mailchimpMembers[j].email_hash)
            if (membersDatabase[i].email_hash == mailchimpMembers[j].email_hash) {
                memberFound = true; //we've found the same list!
            }
        }
        if (!memberFound) {
            //member got removed at mailchimp
            var temp = {
                // 0 - default, 1 - update member, 2- create member, 3 delete remove
                email_hash: membersDatabase[i].email_hash,
                email_addr: membersDatabase[i].email_addr,
                subscriberStatus: membersDatabase[i].subscriberStatus,
                firstName: membersDatabase[i].firstName,
                lastName: membersDatabase[i].lastName,
                action: '3'
            };
            differenceMemArr.push(temp);
        }
    }
    return differenceMemArr;
}