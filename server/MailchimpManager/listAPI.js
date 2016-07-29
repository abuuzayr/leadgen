var request = require('request');
var fs = require('fs');
var mailchimp = require('mailchimp-v3');
var allLists = [];
var apiKey = '89a25dec87f33b2f139df5db995092d7-us13';
mailchimp.setApiKey(apiKey);

mailchimp
	.get('lists')
	.then(function(lists) {
		console.log("Printing lists");
		console.log(lists);
		//var info = JSON.pars0, i<lists.lists.lengthaaaaaasasasa; e(lists);

		for (var i = 0; i < lists.lists.length; i++) {
			var list_name = lists.lists[i].name;
			var list_id = lists.lists[i].id;
			var list_date_created = lists.lists[i].date_created;
			var list_country = lists.lists[i].country;

			var new_list = {
				name: list_name,
				id: list_id,
				date_created: list_date_created,
				country: list_country
			};

			allLists.push(new_list);
		}

		return allLists;

	})

.then(function(allLists) {
	console.log("Get request for members");
	var username = 'anything';
	var subscriberList = [];

	for (var i = 0; i < allLists.length; i++) {
		var idOfList = allLists[i].id;
		var url = 'https://' + username + ':' + apiKey + '@us13.api.mailchimp.com/3.0/lists/' + idOfList + '/members';

		request({
			url: url
		}, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var info = JSON.parse(body);
				console.log(info);
				var

			};
		})
	}

	console.log("Done");
})

.catch(function(error) {
	console.log("There is error");
	console.log(error);
});