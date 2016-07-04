app.factory('contactsColumnData', ['$http', function($http) { 
  return $http.get('http://localhost:8080/api/contacts/leadList/fields') 
    .success(function(data) { 
		console.log(data);
        return data; 
    }) 
    .error(function(err) { 
        return err; 
    }); 
}]);