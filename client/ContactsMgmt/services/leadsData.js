app.factory('leadsData', ['$http', function($http) {  
    return $http.get('//10.4.1.145:8080/api/contacts/leadList/leads')  .success(function(data) {    
        return data;     
    })    .error(function(err) {       
        return err;
    });
}]);
