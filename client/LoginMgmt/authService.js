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
            return $state.go('login');
        }

        function getToken() {
            console.log($cookies.get('userTypeCookie'));
            return $cookies.get('userTypeCookie')
        }

        function deleteToken() {
            return $cookies.remove('userTypeCookie');
        }

        function decodeToken(token) {
            console.log(token);
            if (!token)
                console.log('no cookie') //	return logout();
            var payload = token.split('.')[1];
            var decoded = JSON.parse(atob(payload));
            return decoded;
        }

        function getUserInfo() {
            // var token = getToken();
            var userInfo = JSON.parse(JSON.stringify(decodeToken(token)));
            console.log(token);
            console.log(userInfo);
            return {
                username: userInfo.username,
                email: userInfo.email,
                usertype: userInfo.usertype
            };
        }
    }
})();