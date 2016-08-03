var request = require('request');
var mailchimp = require('mailchimp-v3');
var Promise = require('bluebird');
var username = 'anything';

/**
*Module to handle mailchimp services and API calls
*@exports MailchimpClass
*/

var mailchimpApp = {
     /**
      *Retrieves all mailing list name from the mailchimp server
      *@param {string} apiKey - apikey of the user's mailchimp account
      *@returns {Promise} returns a list or error
      */
    getMyList: function(apiKey) {
        return new Promise(function(resolve, reject) {
            mailchimp.setApiKey(apiKey);
            mailchimp
                .get('lists/?count=1000000')
                .then(function(lists) {
                    var allLists = [];
                    var results;
                    for (var i = 0; i < lists.lists.length; i++) {
                        var list_name = lists.lists[i].name;
                        var list_id = lists.lists[i].id;
                        var list_date_created = lists.lists[i].date_created; //when this list is created
                        var numOfMembers = lists.lists[i].stats.member_count;
                        var numOfUnsubscribe = lists.lists[i].stats.unsubscribe_count;
                        var numOfCampaign = lists.lists[i].stats.campaign_count; //number of campaigns in any status that use this list.
                        var lastCampaignSent = lists.lists[i].stats.campaign_last_sent;
                        var new_list = {
                            name: list_name,
                            id: list_id,
                            dateCreated: list_date_created,
                            numMembers: numOfMembers,
                            numUnsubscribe: numOfUnsubscribe,
                            numCampaign: numOfCampaign,
                            lastSent: lastCampaignSent
                        };
                        allLists.push(new_list);
                    }
                    var arr = [];
                    for (var i = 0; i < allLists.length; i++) {
                        arr.push(getMembers(allLists[i].id, allLists[i].name, apiKey));
                    }
                    return Promise.all(arr);
                })
                .then(function(results) {
                    resolve(results);
                })
                .catch(function(error) {
                    reject(error);
                });

        });
    },
    /**
      *Add a new member to a specific list in mailchimp
      *@param {string} apiKey - apikey of the user's mailchimp account
      *@param {string} listID - the ID of the mailinglist used in mailchimp server
      *@param {object} memberInfo - an object that contains the details of the member to be added.
      *@returns {Promise} returns a success or error
      */
    addMemberToList: function(apiKey, listID, memberInfo) {
        return new Promise(function(resolve, reject) {
            mailchimp.setApiKey(apiKey);
            var batch = mailchimp.createBatch('lists/' + listID + '/members', 'POST');
            console.log("We are in add member");
            var batches = [];
            for (var i = 0; i < memberInfo.length; i++) {
                console.log(memberInfo[i].merge_fields);
                batches.push({
                    body: {
                        status: 'subscribed',
                        email_address: memberInfo[i].email_address,
                        merge_fields: memberInfo[i].merge_fields
                    }
                });
            }
            batch
                .add(batches)
                .send()
                .then(function(result) {
                    resolve(result);
                })
                .catch(function(error) {
                    reject(500);
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
            mailchimp.setApiKey(apiKey);
            console.log("entered list" + listName);
            mailchimp
                .post('lists/', {
                    name: listName,
                    contact: {
                        company: 'gro venture',
                        address1: 'Singapore',
                        city: 'Singapore',
                        state: 'Singapore',
                        zip: '003000',
                        country: 'Singapore'
                    },
                    permission_reminder: 'nil',
                    campaign_defaults: {
                        from_name: 'nil',
                        from_email: 'nil@hotmail.com',
                        subject: 'nil',
                        language: 'English'
                    },
                    email_type_option: true
                })
                .then(function(results) {
                    resolve(results);
                })
                .catch(function(error) {
                    reject(error.status);
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
            mailchimp.setApiKey(apiKey);
            mailchimp
                .delete('/lists/' + listID).then(function(results) {
                    resolve(results);
                })
                .catch(function(error) {
                    reject(error.status);
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
            mailchimp.setApiKey(apiKey);
            mailchimp
                .delete('/lists/' + listID + '/members/' + suscribeHash)
                .then(function(results) {
                    resolve(results);
                })
                .catch(function(error) {
                    reject(500);
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
            mailchimp.setApiKey(apiKey);
            mailchimp
                .get('lists/' + listID + '?count=1000000', listID)
                .then(function(results) {
                    resolve(results);
                })
                .catch(function(error) {
                    reject(500);
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
            mailchimp.setApiKey(apiKey);
            mailchimp
                .patch('lists/' + listID, {
                    name: tempInfo.name,
                    contact: {
                        company: tempInfo.company,
                        address1: tempInfo.address1,
                        city: tempInfo.city,
                        state: tempInfo.state,
                        zip: tempInfo.zip,
                        country: tempInfo.country
                    },
                    permission_reminder: tempInfo.permission_reminder,
                    campaign_defaults: tempInfo.campaign_defaults,
                    email_type_option: tempInfo.email_type_option
                })
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
            mailchimp.setApiKey(apiKey);
            //console.log(memberInfo);
            mailchimp
                .patch('lists/' + listID + '/members/' + suscribeHash, {
                    status: memberInfo.status,
                    email_address: memberInfo.email_addr,
                    merge_fields: memberInfo.merge_fields
                })
                .then(function(results) {
                    resolve(results);
                })
                .catch(function(error) {
                    reject(error);
                });
        });
    },
    /**
      *Retrieves campagin reports information from mailchimp server. Arrange requests in sets of 10.
      *@param {method} getReportDetails - method to allow callback after retrieve is successful.
      *@param {coId} coId - the ID of the company that owns the mailchimp account.
      *@param {Promise} resolve - to allow method to resolve the results to the caller
      *@param {Promise} reject - to allow method to reject the error to the caller
      *@param {string} apiKey - apikey of the user's mailchimp account
      *@returns {Promise} returns error, if success proceeds to recursivemethod1
      */
    getReports: function(getReportDetails, coId, resolve, reject, apiKey) {
        mailchimp
            .get('reports')
            .then(function(report) {
                var promiseArr = [];
                var resultsArr = [];
                var j = 0;
                var totalReportLength = report.reports.length;
                for (var i = 0; i < report.reports.length / 10; i++) {
                    var temp = [];
                    for (var k = 0; k < 10; k++) {
                        console.log(j);
                        if (report.reports[j] != undefined) {
                            var url = 'https://' + username + ':' + apiKey + '@us13.api.mailchimp.com/3.0/reports/' + report.reports[j].id + '/email-activity?count=10000000';
                            console.log(url);
                            temp.push(getIndividualReport(url));
                            j++;
                        }
                    }
                    promiseArr.push(temp);
                }
                recrusiveMethod1(promiseArr, 0, promiseArr.length, resultsArr, getReportDetails, coId, resolve, reject, apiKey);
            })
            .catch(function(error) {
                reject(500);
            });
    }
};
module.exports = mailchimpApp;
    /**
      *Recrusive method that will retrieves reports' information in sets of 10 request at a time.
      *@param {array} promiseArr - Array arranged in sets of 10s will be used to retrieve information from mailchimp server
      *@param {int} count - a variable that will be used to iterate the promiseArr
      *@param {int} count - a variable that will be used denote the end of iteration
      *@param {array} resultsArr - Array to store the information of email activity retrieved from mailchimp server
      *@param {method} getReportDetails - method to allow callback after retrieve is successful.
      *@param {string} coId - the ID of the company that owns the mailchimp account.
      *@param {Promise} resolve - to allow method to resolve the results to the caller
      *@param {Promise} reject - to allow method to reject the error to the caller
      *@param {string} apiKey - apikey of the user's mailchimp account
      *@returns {Array} returns array, if iteration is not completed, proceed to recursivemethod1 again
      */
var recrusiveMethod1 = function(promiseArr, count, totalCount, resultsArr, getReportDetails, coId, resolve, reject, apiKey) {
    console.log('we are in recursive');
    if (count == totalCount) {
        var finalResults = [];
        for (var i = 0; i < resultsArr.length; i++) {
            for (var j = 0; j < resultsArr[i].length; j++) {
                finalResults.push(resultsArr[i][j]);
            }
        }
        getReportDetails(finalResults, coId, resolve, reject);
    } else {
        var tempPromise = promiseArr[count];
        Promise.all(tempPromise)
            .then(function(results) {
                resultsArr.push(results);
                count = count + 1;
                recrusiveMethod1(promiseArr, count, totalCount, resultsArr, getReportDetails, coId, resolve, reject, apiKey);
            })
            .catch(function(rm1Error) {
                console.log(rm1Error);
                reject(500);
            });
    }
};
    /**
      *Retrieve the members of a specific mailing list
      *@param {string} id - ID of the mailinglist
      *@param {string} name - name of the selected mailinglist
      *@param {string} apiKey - apikey of the user's mailchimp account
      *@returns {Promise} returns success or error
      */
var getMembers = function(id, name, apiKey) {
    return new Promise(function(resolve, reject) {
        var err = null;
        var results = [];
        var allUsers = [];
        var url = 'https://' + username + ':' + apiKey + '@us13.api.mailchimp.com/3.0/lists/' + id + '/members?count=1000000';
        request({
            url: url
        }, function(error, response, body) {
            if (error !== null) {
                reject(error);
            } else {
                var info = JSON.parse(body);
                for (var j = 0; j < info.members.length; j++) {
                    var emailAddress = info.members[j].email_address;
                    var userStatus = info.members[j].status;
                    var userFirstName = info.members[j].merge_fields.FNAME;
                    var userLastName = info.members[j].merge_fields.LNAME;
                    var countryCode = info.members[j].location.country_code;
                    var uniqueEmailid = info.members[j].id;
                    var newUser = {
                        email_hash: uniqueEmailid,
                        email_addr: emailAddress,
                        subscriberStatus: userStatus,
                        firstName: userFirstName,
                        lastName: userLastName
                    };
                    allUsers.push(newUser);
                }
                var obj = {
                    name: name,
                    listID: id,
                    members: allUsers
                };
                results = obj;
                allUsers = [];
                count++;
                resolve(results);
            }
        });
    });
};
    /**
      *Retrieves a specific report based on the campagin url
      *@param {string} url - the url request to retrieve the report infomation from mailchimp server
      *@returns {Promise} returns the request information or error
      */
var	getIndividualReport = function(url){
	return new Promise(function(resolve, reject) {
		request({
			url: url
		}, function(error, response, body) {
			if (error !== null) {
				reject(error);
			} else {
				var info = JSON.parse(body);
				resolve(info);
				}
			});

	});
}
