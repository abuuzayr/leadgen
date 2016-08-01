(function() {
    'use strict';
    app.factory('leadsData', ['$http', 'appConfig', function($http, appConfig) {  
        return $http.get(appConfig.API_URL + '/contacts/leadList/leads')  .success(function(data) {    
            return data;     
        })    .error(function(err) {       
            return err;
        });
    }]);
})();