app.factory('localData', ['$http', function($http) { 
  return $http.get('DatabaseMgmt/testFiles/localData.json')
    .success(function(data) { 
        return data; 
    }) 
    .error(function(err) { 
        return err; 
    }); 
}]);