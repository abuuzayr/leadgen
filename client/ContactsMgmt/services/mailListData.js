(function() {
    'use strict';
    app.factory('mailListData', ['$http', 'appConfig', function($http, appConfig) {  
        return $http.get(appConfig.API_URL + '/contacts/mailingList')  .success(function(data) {    
            return data;    
        })    .error(function(err) {        
            return err;    
        });
    }]);
})();