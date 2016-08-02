// Get black leads from database 
(function() {
    'use strict';
    app.factory('blackLeadsData', ['$http', 'appConfig', function($http, appConfig) {  
        return $http.get(appConfig.API_URL + '/contacts/blackList').success(function(data) {
            return data;    
        })    .error(function(err) {       
            return err;    
        });
    }]);
})();