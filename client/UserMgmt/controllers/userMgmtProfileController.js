(function() {
    'use strict';
    app.controller('userMgmtProfileController', ['$scope', '$http', 'uiGridConstants', '$q', '$location', '$timeout', 'companyProfile', 'feedbackServices', 'appConfig', 'authServices',
        function($scope, $http, uiGridConstants, $q, $location, $timeout, companyProfile, feedbackServices, appConfig, authServices) {

            var uc = this;

            uc.company = '';
            uc.email = '';
            uc.checkConsumer = '';
            uc.checkCorporate = '';

            /** Get company info from cookie */
            if (authServices.getToken()) {
                uc.company = authServices.getUserInfo().companyName;
                uc.email = authServices.getUserInfo().email;
                uc.checkConsumer = authServices.getUserInfo().subType.consumer;
                uc.checkCorporate = authServices.getUserInfo().subType.corporate;

            }

            /* =========================================== Load animation =========================================== */
            var viewContentLoaded = $q.defer();

            $scope.$on('$viewContentLoaded', function() {
                $timeout(function() {
                    viewContentLoaded.resolve();
                }, 0);
            });
            viewContentLoaded.promise.then(function() {
                $timeout(function() {
                    componentHandler.upgradeDom();
                }, 0);
            });
        }
    ]);
})();