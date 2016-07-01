app.factory('detailedMailListData', ['$http', function($http) { 
  return $http.get('ContactsMgmt/controllers/mailListData.json') 
    .success(function(data) { 
        return data; 
    }) 
    .error(function(err) { 
        return err; 
    }); 
}]);