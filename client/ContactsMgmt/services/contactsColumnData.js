app.factory('contactsColumnData', ['$http', 'appConfig', function($http, appConfig) {  
	return $http.get(appConfig.API_URL + '/contacts/leadList/fields')  .success(function(data) {
		console.log(data);     
		return data;    
	})    .error(function(err) {    
		return err;    
	});
}]);