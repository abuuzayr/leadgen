app.factory('leadsData', ['$http', function($http) {  
    return $http.get('http://10.4.1.145/api/contacts/leadList/leads')  .success(function(data) {    
        return data;     
    })    .error(function(err) {       
        return err;
    });
}]);