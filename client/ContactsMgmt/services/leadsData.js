app.factory('leadsData', ['$http', function($http) { 
  return $http.get('ContactsMgmt/controllers/testData.json') 
            .success(function(data) { 
              return data; 
            }) 
            .error(function(err) { 
              return err; 
            }); 
}]);