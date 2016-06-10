var request = require('request');
var fs = require('fs');
var mailchimp = require('mailchimp-v3');
var allLists = [];
mailchimp.setApiKey('89a25dec87f33b2f139df5db995092d7-us13');

mailchimp
	.get('lists')
	.then(function(lists) {
		console.log("Printing lists");
		console.log(lists);
		//var info = JSON.pars0, i<lists.lists.length; e(lists);
		
		for (var i=0; i<lists.lists.length; i++) {
			var list_name = lists.lists[i].name;
			console.log("List name is " + list_name);

			var list_id = lists.lists[i].id;
			console.log("List id is " + list_id);

			var list_date_created = lists.lists[i].date_created;
			console.log("List date is " + list_date_created);

			var list_country = lists.lists[i].country;
			console.log("List country is " + list_country);

			var new_list = {
			name : list_name,
			id : list_id,
			date_created : list_date_created,
			country : list_country
			};

			allLists.push(new_list);
		}
		console.log("Length of list is " + lists.lists.length);
		
		for (var i=0; i<lists.lists.length; i++) {
			console.log("List name at index " + i + " is " + allLists[i].name);
		}

	})
	.catch(function(error) {
		console.log("There is error");
		console.log(error);
	});
