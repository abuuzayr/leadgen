app.factory('mailListData', ['$http', function($http) { 
  return $http.get('ContactsMgmt/controllers/testMail.json') 
            .success(function(data) { 
              return data; 
            }) 
            .error(function(err) { 
              return err; 
            }); 
}]);