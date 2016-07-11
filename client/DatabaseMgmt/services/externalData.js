app.factory('externalData', ['$http', function($http) { 
  return $http.get('DatabaseMgmt/testFiles/externalData.json')
    .success(function(data) { 
        return data; 
    }) 
    .error(function(err) { 
        return err; 
    }); 
}]);