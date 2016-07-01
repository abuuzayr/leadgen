app.factory('blackLeadsData', ['$http', function($http) { 
  return $http.get('ContactsMgmt/controllers/blackTestData.json') 
    .success(function(data) {
        return data; 
    }) 
    .error(function(err) { 
        return err; 
    }); 
}]);