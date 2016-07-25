(function() {
    'use strict';

    angular
        .module("app")
        .factory("authServices", authServices)

    authServices.$inject = ['appConfig', 'feedbackServices', '$http', '$window', '$state', '$location', '$cookies'];

    function authServices(appConfig, feedbackServices, $http, $window, $state, $location, $cookies) {
        var service = {
            logout: logout,
            getToken: getToken,
            deleteToken: deleteToken,
            decodeToken: decodeToken,
            getUserInfo: getUserInfo
        };
        return service;

        function logout() {
            deleteToken();
            return $state.go('login');
        }

        function getToken() {
            console.log($cookies.get('userTypeCookie'));
            return $cookies.get('userTypeCookie')
        }

        function deleteToken() {
            console.log('remove cookie');
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
            var token = getToken();
            var userInfo = JSON.parse(JSON.stringify(decodeToken(token)));
            // console.log(token);
            // console.log(userInfo);
            console.log(userInfo.subscriptionType);
            console.log(userInfo.companyName);
            return {
                username: userInfo.username,
                email: userInfo.email,
                usertype: userInfo.usertype,
                subType: userInfo.subscriptionType,
                companyName: userInfo.companyName,
                companyId: userInfo.companyId,
                userId: userInfo.userId
            };
        }
    }
})();