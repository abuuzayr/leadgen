app.factory('domainsData', ['$http', function($http) {  
    return $http.get('//10.4.1.145/api/contacts/blackList/domain')  .success(function(data) {    
        return data;    
    }) .error(function(err) {        
        return err;    
    });
}]);