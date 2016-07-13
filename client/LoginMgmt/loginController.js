(function() {
    'use strict';

    app.controller("loginController", loginController);

    loginController.$inject = ['$scope', '$q', '$interval', '$timeout', 'authServices', 'feedbackServices', 'dialogServices'];

    function loginController($scope, $q, $interval, $timeout, authServices, feedbackServices, dialogServices) {
        /* =========================================== Initialization =========================================== */
        var vm = this;
        var errMsg;
        var MAX_PASSWORD_LENGTH = 24;
        var MIN_PASSWORD_LENGTH = 8;

        /* =========================================== Declare functions =========================================== */
        vm.validateBeforeLogin = validateBeforeLogin;
        vm.validateBeforeSend = validateBeforeSend;
        vm.openDialog = openDialog;
        vm.closeDialog = closeDialog;

        /* =========================================== Helper =========================================== */
        function isEmpty(inputStr) {
            if (inputStr != null && inputStr != undefined && inputStr.length >= 1) {
                return false;
            } else return true;
        }

        function isValidEmail(emailStr) {
            var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailPattern.test(emailStr);
        }

        function isValidPassword(inputStr) {
            return inputStr.length >= MIN_PASSWORD_LENGTH && inputStr.length <= MAX_PASSWORD_LENGTH
        }

        /* =========================================== Main login =========================================== */
        function validateBeforeLogin() {
            var email = '';
            var password = '';
            var errMsg = '';

            if (isEmpty(vm.email) || isEmpty(vm.password)) {
                return;
            } else if (!isValidEmail(vm.email)) {
                errMsg = 'Email is invalid.';
            } else if (!isValidPassword(vm.password)) {
                errMsg = 'Password is between 8 and 24 characters.';
            } else {
                email = vm.email
                password = vm.password;
                return feedbackServices.successFeedback('Logging in... Please hold on.', '#login-feedbackMessage').then(login(email, password));
            }
            return feedbackServices.errorFeedback(errMsg, '#login-feedbackMessage');
        }

        function validateBeforeSend() {
            var email = ''
            if (isValidEmail(vm.forgotPasswordEmail)) {
                email = vm.forgotPasswordEmail;
                return feedbackServices.successFeedback('Sending email to ' + email, '#login-feedbackMessage').then(getNewPassword(email));
            }
            errMsg = 'Email is invalid.';
            return feedbackServices.errorFeedback(errMsg, '#login-feedbackMessage');
        }

        /* =========================================== API =========================================== */
        function login(email, password) {
            return authServices.login(email, password);
        }

        function getNewPassword() {
            var email = vm.forgotPasswordEmail;
            return authServices.forgetPassword(email)
        }

        /* =========================================== Dialog =========================================== */
        function openDialog(dialogName) {
            dialogServices.openDialog(dialogName);
        }

        function closeDialog(dialogName) {
            dialogServices.closeDialog(dialogName);
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