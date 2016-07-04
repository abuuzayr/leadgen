app.factory('domainsData', ['$http', function($http) { 
  return $http.get('http://localhost:8080/api/contacts/blackList/domain') 
    .success(function(data) { 
        return data; 
    }) 
    .error(function(err) { 
        return err; 
    }); 
}]);