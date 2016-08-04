(function() {
    'use strict';
    angular.module("app")
        .controller("loginCtrl", loginCtrl);

    loginCtrl.$inject = ['$scope', '$q', '$location', '$timeout', '$state', '$http', 'appConfig', 'feedbackServices', 'dialogServices', '$cookies', 'authServices'];

    function loginCtrl($scope, $q, $location, $timeout, $state, $http, appConfig, feedbackServices, dialogServices, $cookies, authServices) {

        /* =========================================== Initialisation =========================================== */
        var vm = this;
        var MAX_PASSWORD_LENGTH = appConfig.MAX_PASSWORD_LENGTH;
        var MIN_PASSWORD_LENGTH = appConfig.MIN_PASSWORD_LENGTH;
        var AUTH_URL = appConfig.AUTH_URL;
        var FP_URL = appConfig.FP_URL;
        var API_URL = appConfig.API_URL;

        vm.loginEmail = '';
        vm.password = '';
        vm.resetPwdEmail = '';

        vm.validateBeforeLogin = validateBeforeLogin;
        vm.validateBeforeSend = validateBeforeSend;
        vm.closeDialog = closeDialog;
        vm.openDialog = openDialog;

        /* =========================================== UI =========================================== */
        /**
         * Checks if email and password are valid. Returns function login if valid. Else, return feedback with error message.
         * 
         * @returns {promise} if invalid
         * @returns {function} if valid
         */
        function validateBeforeLogin() {
            var email = '';
            var password = '';
            var errMsg = '';

            if (isEmpty(vm.loginEmail) || isEmpty(vm.password)) {
                return;
            } else if (!isValidEmail(vm.loginEmail)) {
                errMsg = 'Email is invalid.';
            } else if (!isValidPassword(vm.password)) {
                errMsg = 'Password is between ' + MIN_PASSWORD_LENGTH + ' and ' + MAX_PASSWORD_LENGTH + ' characters.';
            } else {
                email = vm.loginEmail;
                password = vm.password;
                return login(email, password);
            }
            errorFeedback(errMsg);
        }

        /**
         * Checks if email is valid before sending new generated password to email. Send email if valid. Else, return display feedback message.
         * 
         * @returns {function} if valid
         * @returns {promise} is invalid
         */
        function validateBeforeSend() {
            var email = '';
            var errMsg = '';
            console.log('Email : ' + vm.resetPwdEmail);
            if (!isValidEmail(vm.resetPwdEmail)) {
                errMsg = 'Email is invalid.';
                return errorFeedback(errMsg);
            } else {
                email = vm.resetPwdEmail;
                return sendEmail(email);
            }
        }


        /* =========================================== API =========================================== */
        /**
         * Authenticate user email and password. 
         * If user log in successful, display success feedback message, return cookie and redirect to home. 
         * Else, display error feedback message and delete existing cookie.
         * 
         * @param {any} email
         * @param {any} password
         */
        function login(email, password) {
            $http.post(AUTH_URL, {
                    email: email,
                    password: password,
                    origin: 'bulletlead.com'
                })
                .then(SuccessCallback)
                .catch(ErrorCallback);

            function SuccessCallback(res) {
                console.log(res);
                return successFeedback('Logged in')
                    .then(
                        $http.get(API_URL + '/cookie')
                        .then(function(res) {
                            $state.go('home');
                        })
                    )
                    // .then(function(res) {
                    //     console.log(res);
                    //     $state.go('home');
                    // })
                    .catch(function(err) {
                        errorFeedback('Login blocked by app server');
                    });
            }

            function ErrorCallback(err) {
                authServices.deleteToken();
                errorFeedback(err.data);
            }
        }

        /**
         * Send auto-generated new password to user. Pre-condition: email has to be vaild.
         * 
         * @param {any} email
         */
        function sendEmail(email) {
            $http.post(FP_URL, {
                    email: email
                })
                .then(SuccessCallback)
                .catch(ErrorCallback);

            function SuccessCallback(res) {
                console.log(res);
                vm.resetPwdEmail = '';
                return successFeedback('email sent to' + email);
            }

            function ErrorCallback(err) {
                console.log(err);
                return errorFeedback(err.data);
            }
        }

        /* =========================================== Helper Function =========================================== */
        function openDialog() {
            return dialogServices.openDialog('forgot-password-dialog');
        }

        function closeDialog() {
            return dialogServices.closeDialog('forgot-password-dialog');
        }

        function successFeedback(msg, timeout) {
            return feedbackServices.successFeedback(msg, '#login-feedbackMessage', timeout)
        }

        function errorFeedback(errData, timeout) {
            return feedbackServices.errorFeedback(errData, '#login-feedbackMessage', timeout)
        }

        function isEmpty(str) {
            return str == null || str == undefined || str.length < 1;
        }

        function isValidEmail(str) {
            var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailPattern.test(str);
        }

        function isValidPassword(str) {
            return str.length >= MIN_PASSWORD_LENGTH && str.length <= MAX_PASSWORD_LENGTH
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
})();