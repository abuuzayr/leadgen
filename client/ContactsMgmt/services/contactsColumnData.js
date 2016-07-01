app.factory('contactsColumnData', ['$http', function($http) { 
  return $http.get('ContactsMgmt/controllers/contactsMainColumns.json') 
    .success(function(data) { 
        return data; 
    }) 
    .error(function(err) { 
        return err; 
    }); 
}]);