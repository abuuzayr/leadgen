app.factory('allUsersData', ['$http', function($http) { 
  return $http.get('UserMgmt/testFiles/testData.json')
    .success(function(data) { 
        return data; 
    }) 
    .error(function(err) { 
        return err; 
    }); 
}]);