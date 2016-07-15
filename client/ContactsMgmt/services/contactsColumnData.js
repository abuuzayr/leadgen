app.factory('contactsColumnData', ['$http', function($http) {  
	return $http.get('//10.4.1.145/api/contacts/leadList/fields')  .success(function(data) {
		console.log(data);     
		return data;    
	})    .error(function(err) {    
		return err;    
	});
}]);