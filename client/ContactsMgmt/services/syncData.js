(function() {
    'use strict';
    app.factory('syncData', ['$http', 'appConfig', function($http, appConfig) {  
        return $http.get(appConfig.API_URL + '/contacts/sync')  .success(function(data) {    
            return data;     
        })    .error(function(err) {       
            return err;
        });
    }]);
})();