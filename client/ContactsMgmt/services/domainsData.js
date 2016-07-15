app.factory('domainsData', ['$http', 'appConfig', function($http, appConfig) {  
    return $http.get(appConfig.API_URL + '/contacts/blackList/domain')  .success(function(data) {    
        return data;    
    }) .error(function(err) {        
        return err;    
    });
}]);