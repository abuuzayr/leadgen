app.factory('allData', ['$http', function($http) { 
  return $http.get('DatabaseMgmt/testFiles/testData.json')
    .success(function(data) { 
        return data; 
    }) 
    .error(function(err) { 
        return err; 
    }); 
}]);