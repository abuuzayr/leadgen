app.factory('blackLeadsData', ['$http', function($http) { 
  return $http.get('http://localhost:8080/api/contacts/blackList') 
    .success(function(data) {
        return data; 
    }) 
    .error(function(err) { 
        return err; 
    }); 
}]);