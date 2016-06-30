app.factory('getDetails', ['$http', function($http) {
    return $http.get('ProfileMgmt/testFiles/userDetails.json') 
        .success(function(data) { 
            return data; 
        }) 
        .error(function(err) { 
            return err; 
        }); 
}])