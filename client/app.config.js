(function() {
    'use strict';

    angular
        .module('app')
        .constant('appConstant', {
            APP_VERSION: '0.1',
            //API_URL: 'http://localhost:8080/api'
            API_URL: 'https://10.4.1.198/req/api'
        });
})();