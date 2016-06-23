app.factory('historyData', ['$http', function($http) { 
  return $http.get('ContactsMgmt/controllers/historyTestData.json') 
            .success(function(data) { 
              return data; 
            }) 
            .error(function(err) { 
              return err; 
            }); 
}]);