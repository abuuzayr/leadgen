var request = require('request');
var mailchimp = require('mailchimp-v3');
var Promise = require('bluebird');
var username = 'anything';
var count = 0;
var mailchimpApp = {
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
	addMemberToList: function(apiKey, listID, memberInfo) {
		return new Promise(function(resolve, reject) {
			mailchimp.setApiKey(apiKey);
			mailchimp
				.post('lists/'+listID+'/members', {
					status: 'subscribed',
					email_address: memberInfo.email_address,
					merge_fields: memberInfo.merge_fields
				})
				.then(function(results) {
					resolve(results);
				})
				.catch(function(error) {
					console.log("Add members in list" + error);
				});
		});
	},
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
	deleteMember: function(apiKey, listID, suscribeHash) {
		return new Promise(function(resolve, reject) {
			mailchimp.setApiKey(apiKey);
			mailchimp
				.delete('/lists/' + listID + '/members/' + suscribeHash)
				.then(function(results) {
					resolve(results);
				})
				.catch(function(error) {
					reject(error.status);
				});
		});
	},
	getListInformation: function(apiKey, listID) {
		return new Promise(function(resolve, reject) {
			mailchimp.setApiKey(apiKey);
			mailchimp
				.get('lists/' + listID + '?count=1000000', listID)
				.then(function(results) {
					resolve(results);
				})
				.catch(function(error) {
					reject(error);
				});
		});
	},
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
	getReports: function(getReportDetails, coId, resolve, reject) {
		mailchimp
			.get('reports')
			.then(function(report) {
				console.log('reportCount');
				console.log(report.reports.length);
				var results = [];
				for (var i = 0; i < report.reports.length; i++) {
					mailchimp
						.get('reports/' + report.reports[i].id + '/email-activity?count=1000000')
						.then(function(activity) {
							console.log('Retrieve Loop:'+i);
							results.push(activity);
							if (results.length == report.reports.length) {
								getReportDetails(results, coId, resolve, reject);
							}
						});
				}
			}).catch(function(error) {
				reject(error);
			});
	}
};
module.exports = mailchimpApp;

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