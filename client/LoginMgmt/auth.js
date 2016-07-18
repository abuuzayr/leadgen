(function() {
    'use strict';

    app
        .run(auth);

    auth.$inject = ['$rootScope', '$state', '$window', '$location', 'authServices'];

    // Block access if user is not logged in
    function auth($rootScope, $state, $window, $location, authServices) {
        $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {
            // var token = authServices.getToken();
            if (error === false) {
                $state.go('login');
            }
        })
    };
})();