app.factory('domainsData', ['$http', function($http) { 
  return $http.get('ContactsMgmt/controllers/domainsTestData.json') 
            .success(function(data) { 
              return data; 
            }) 
            .error(function(err) { 
              return err; 
            }); 
}]);