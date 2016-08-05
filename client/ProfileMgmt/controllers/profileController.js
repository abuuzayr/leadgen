(function() {
    'use strict';
    app.controller('profileController', ['$scope', '$http', '$q', '$location', '$timeout', 'appConfig', '$window', 'feedbackServices', '$cookies', 'authServices',
        function($scope, $http, $q, $location, $timeout, appConfig, $window, feedbackServices, $cookies, authServices) {

            var pc = this;
            pc.profileData = {};
            pc.pwd = {};
            pc.newPwd = '';
            pc.retypePwd = '';
            pc.showPassword = true;

            /** Gets Username and Email from cookie */
            pc.userName = '';
            pc.userEmail = '';


            if (authServices.getToken()) {
                pc.userName = authServices.getUserInfo().username;
                pc.userEmail = authServices.getUserInfo().email;

                if (authServices.getUserInfo().usertype === 'User') {
                    pc.showPassword = false;
                }
            }

            /** 
             * Change password and updates database
             * @params {Object} data 
             */
            pc.changePassword = function() {

                var path = '/acct';
                var req = {
                    method: 'PATCH',
                    url: appConfig.API_URL + path,

                    headers: {},
                    data: {
                        pwd: pc.pwd
                    }
                };
                if ($window.sessionStorage.token) {
                    req.headers.Authorization = $window.sessionStorage.token;
                }
                return $http(req)
                    .then(SuccessCallback)
                    .catch(ErrorCallback);

                function SuccessCallback(res) {
                    return feedbackServices.successFeedback('Password updated', '#profileFeedback', 2000);
                }

                function ErrorCallback(err) {
                    return feedbackServices.hideFeedback('#profileFeedback').
                    then(feedbackServices.errorFeedback('Unable to change password', '#profileFeedback'));
                }
            };

            /** 
             * Checks the new password and retype password
             * @returns {promise} if invalid
             * @returns {function} if valid
             */
            pc.validateNewPassword = function() {
                if (pc.newPwd === pc.retypePwd) {
                    // pc.userPassword = pc.newPwd;
                    pc.pwd.newPwd = pc.newPwd;
                    return pc.changePassword();
                }
                return feedbackServices.hideFeedback('#profileFeedback').
                then(feedbackServices.errorFeedback('New password inputs do not match', '#profileFeedback'));
            };

            /* =========================================== Load animation =========================================== */
            var viewContentLoaded = $q.defer();

            $scope.$on('$viewContentLoaded', function() {
                $timeout(function() {
                    viewContentLoaded.resolve();
                }, 0);
            });
            viewContentLoaded.promise.then(function() {
                $timeout(function() {
                    // pc.getFromDatabase();
                    componentHandler.upgradeDom();
                }, 0);
            });
        }
    ]);
})();