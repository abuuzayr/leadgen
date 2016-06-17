var request = require('request');

var apiKey = 'AIzaSyDUmAlO04YdvK8Ka49qUhPSZD0pnwEv1Yc';
var nextPageToken;

var ScrapManager = {
	scrapCorporateGoogleNew : function(type,location){
		return new Promise(function(resolve,reject){
			var url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + type + '+companies+in+' + location +'&key=' + apiKey;
			requestGoogle(url)
			.then(function(places){
				var arr = [];
				nextPageToken = places.next_page_token;
				for(var i=0;i<places.results.length;i++){
					var urlDetails = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+ 
					places.results[i].place_id +'&key=' + apiKey;
					arr.push(requestGoogle(urlDetails));
				}
				return Promise.all(arr);	
			})
			.then(function(results){
				console.log(results);
			})
			.catch(function(error){
				console.log(error);
			})
		});
	},
	scrapCorporateGoogleCont : function(){
		return new Promise(function(resolve,reject){
			var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=' + nextPageToken +'&key=' + apiKey;
			requestGoogle(url)
			.then(function(places){
				var arr = [];
				nextPageToken = places.next_page_token;
				for(var i=0;i<places.results.length;i++){
					var urlDetails = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+ 
					places.results[i].place_id +'&key=' + apiKey;
					arr.push(requestGoogle(urlDetails));
				}
				return Promise.all(arr);	
			})
			.then(function(results){
				console.log(results);
			})
			.catch(function(error){
				console.log(error);
			})
		});
	},
	scrapCorporateYellowPage : function(){

	},
	scrapConsumersYellowPage : function(){

	}

};


var requestGoogle  = function(url){
	return new Promise(function(resolve,reject){
		request(url,function(error,response,body){
			if(error!=null)
				reject(error);
			else{
				resolve(JSON.parse(body));
			}
		});
	});
};

module.exports = ScrapManager;
