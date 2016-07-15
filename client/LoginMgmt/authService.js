(function() {
    'use strict';

    angular
        .module("app")
        .factory("authServices", authServices)

    authServices.$inject = ['appConfig', 'feedbackServices', '$http', '$window', '$state', '$location'];

    function authServices(appConfig, feedbackServices, $http, $window, $state, $location) {
        var service = {
            login: login,
            logout: logout,
            forgetPassword: forgetPassword,
            setToken: setToken,
            getToken: getToken,
            deleteToken: deleteToken,
            decodeToken: decodeToken,
            getUserInfo: getUserInfo
        }
        return service;



        function login(email, password) {
            return $http.post(API_URL + '/auth/admin', {
                    email: email,
                    password: password
                })
                .then(loginSuccess)
                .catch(loginError);

            function loginSuccess(res) {
                setToken(res.data.token);
                feedbackServices.hideFeedback('#login-feedbackMessage')
                    .then(feedbackServices.successFeedback('logged in', '#login-feedbackMessage'))
                    .then($state.go('companies'));


            }

            function loginError(err) {
                deleteToken();
                feedbackServices.hideFeedback('#login-feedbackMessage')
                    .then(feedbackServices.errorFeedback(err.data, '#login-feedbackMessage'));
            }
        }

        function logout() {
            deleteToken();
            $location.path('/login');
        }

        function forgetPassword(email) {
            return $http.post(API_URL + '/forgetpassword/admin', {
                    email: email,
                })
                .then(callSuccess)
                .catch(callError);

            function callSuccess(res) {
                return feedbackServices.hideFeedback('#login-feedbackMessage')
                    .then(feedbackServices.successFeedback('Email sent to ' + email, '#login-feedbackMessage'))
            }

            function callError(err) {
                return feedbackServices.hideFeedback('#login-feedbackMessage')
                    .then(feedbackServices.errorFeedback(err.data, '#login-feedbackMessage'));
            }
        }


        function setToken(token) {
            if (token)
                $window.sessionStorage.token = token;
            else
                return;
        }

        function getToken() {
            if ($window.sessionStorage) {
                var token = $window.sessionStorage.token == "null" ? null : $window.sessionStorage.token;
                return token;
            }
            return null;
        }

        function deleteToken() {
            if ($window.sessionStorage)
                $window.sessionStorage.token = null;
            return;
        }

        function decodeToken(token) {
            if (!token) {
                // throw new Error('token not presented');
                return feedbackServices.hideFeedback('#login-feedbackMessage')
                    .then(feedbackServices.errorFeedback('Token not presented', '#login-feedbackMessage'));
            }
            var payload = token.split('.')[1];
            var decoded = JSON.parse(atob(payload));
            return decoded;
        }

        function getUserInfo() {
            var token = getToken();
            var userInfo = decodeToken(token);
            return JSON.parse(JSON.stringify(userInfo));
        }
    }
})();