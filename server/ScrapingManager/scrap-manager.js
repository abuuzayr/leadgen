var request = require('request'),
fs = require('fs'),
config = require('../config');

var apiKey  = 'AIzaSyDUmAlO04YdvK8Ka49qUhPSZD0pnwEv1Yc';

//var nextPageToken = null;

var ScrapManager = {
	scrapCorporateGoogleNew : function(index,type){
		return new Promise(function(resolve,reject){
			loadCoordinates(index)
			.then(function(arr){
				var url = 'https://maps.googleapis.com/maps/api/place/radarsearch/json?location=' + arr[0] + ',' + arr[1] + '&radius=3000&keyword=' + type + '&key=' + apiKey;
				
				requestGoogle(url)
				.then(function(places){
					var arr1 = [];
					for(var i=0;i<places.results.length;i++){
						var urlDetails = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+ 
						places.results[i].place_id +'&key=' + apiKey;
						arr1.push(requestGoogle(urlDetails));
					}
					return Promise.all(arr1);	
				})
				.then(function(results){
					var arr = [];
					
					for(var i=0;i<results.length;i++){
						var obj = {
							firstName : null,
							lastName : null,
							email : null,
							companyName : results[i].result.name,
							phoneNumber : results[i].result.international_phone_number,
							category : type,
							type : 1,
							origin : 1
						};
						arr.push(obj);
					}

					resolve(arr);
				})
				.catch(function(error){
					reject(error);
				})
			})
			.catch(function(error){
				reject(error);
			})
				
		});
	},
	scrapCorporateYellowPage : function(type){
		//QUERY FROM SERVER CORPORATE DB
		//RETURN objects that match type
	},
	scrapConsumersYellowPage : function(type){
		//QUERY FROM SERVER CONSUMER DB
		//RETURN objects that match type
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

var loadCoordinates = function(index){
	return new Promise(function(resolve,reject){
		var arr = [];
		console.log(config.coordinates.length);
		if(index > config.coordinates.length)
			reject('index out of bounds');
		else{
			arr.push(config.coordinates[index].Latitude);
			arr.push(config.coordinates[index].Longitude);
			console.log(arr);
			resolve(arr);
		}
		
	});
}

/*var getApiKey = function(){
	return new Promise(function(resolve,reject){
		fs.access('../apikey.txt',fs.F_OK,function(err){
			if(err != null){
				reject('API key unspecified');
			}else{
				fs.readFile('../apikey.txt',function(err,data){
					if(err!=null){
						reject('Error reading file');
					}else{
						resolve(data);
					}
				});
			}
		})
	});
};*/

module.exports = ScrapManager;
