angular.module("app")
    .controller("loginCtrl", loginCtrl);

loginCtrl.$inject = ['$scope', '$q', '$location', '$timeout', '$state', '$http', 'appConfig', 'feedbackServices', 'dialogServices', 'userService', '$cookies'];

function loginCtrl($scope, $q, $location, $timeout, $state, $http, appConfig, feedbackServices, dialogServices, userService, $cookies) {

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

    vm.testValidation = testValidation;
    vm.determineType = determineType;

    function testValidation() {
        var email = '';
        var password = '';
        var errMsg = '';

        var type = '';

        if (isEmpty(vm.loginEmail) || isEmpty(vm.password)) {
            return;
        } else if (!isValidEmail(vm.loginEmail)) {
            errMsg = 'Email is invalid.';
        } else if (!isValidPassword(vm.password)) {
            errMsg = 'Password is between ' + MIN_PASSWORD_LENGTH + ' and ' + MAX_PASSWORD_LENGTH + ' characters.';
        } else {
            email = vm.loginEmail
            password = vm.password;
            return determineType(email, password);
        }
        errorFeedback(errMsg);
    }

    function determineType(email, password) {
        if (email === 'user@bulletlead.com') {
            if (password === 'password') {
                successFeedback('Logged in');
                userService.setUserType('user');
                $cookies.put('type', 'user');

                $state.go('home');
            } else {
                errorFeedback('Unable to log in');;
            }
        } else if (email === 'admin@bulletlead.com') {
            if (password === 'password') {
                successFeedback('Logged in');
                userService.setUserType('admin');
                $cookies.put('type', 'admin');

                $state.go('home');
            } else {
                errorFeedback('Unable to log in');;
            }
        } else if (email === 'superadmin@bulletlead.com') {
            if (password === 'password') {
                successFeedback('Logged in');
                userService.setUserType('superadmin');
                $cookies.put('type', 'superadmin');


                $state.go('home');
            } else {
                errorFeedback('Unable to log in');;
            }
        }
    }


    /* =========================================== UI =========================================== */
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
            email = vm.loginEmail
            password = vm.password;
            return login(email, password);
        }
        errorFeedback(errMsg);
    }

    function validateBeforeSend() {
        var email = '';
        var errMsg = '';

        if (!isValidEmail(vm.resetPwdEmail)) {
            errMsg = 'Email is invalid.';
            return errorFeedback(errMsg);
        } else {
            email = vm.resetPwdEmail
            return sendEmail(email);
        }
    }


    /* =========================================== API =========================================== */
    function login(email, password) {
        $http.post(AUTH_URL, {
                email: email,
                password: password,
                origin: 'bulletleads.com'
            })
            .then(SuccessCallback)
            .catch(ErrorCallback);

        function SuccessCallback(res) {
            return successFeedback('Logged in')
                .then($http.get(API_URL + '/auth/'))
                .then(function(res) {
                    $state.go('home');
                })
                .catch(function(err) {
                    errorFeedback('Login blocked by app server');
                });
        }

        function ErrorCallback(err) {
            errorFeedback(err.data);
        }
    }

    function sendEmail(email) {
        $http.post(FP_URL, {
                email: email,
                origin: 'bulletleads.com'
            })
            .then(SuccessCallback)
            .catch(ErrorCallback);

        function SuccessCallback(res) {
            return successFeedback('email sent to' + email);
        }

        function ErrorCallback(err) {
            return errorFeedback(err.data);
        }
    }

    /* =========================================== Helper Function =========================================== */
    function openDialog() {
        return dialogServices.openDialog('forgot-password-dialog')
    }

    function closeDialog() {
        return dialogServices.closeDialog('forgot-password-dialog')
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