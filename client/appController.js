app.controller('appController', ['$scope', '$q', '$location', '$timeout', 'userService', '$cookies', 'authServices',
    function($scope, $q, $location, $timeout, userService, $cookies, authServices) {

        var vm = this;
        vm.toShow = {};
        // var getCookie;

        // if (authServices.getToken() && (authServices.getUserInfo().usertype) {
        // getCookie = authServices.getToken();
        // if (angular.isDefined(getCookie)) {
        //     vm.type = authServices.getUserInfo().usertype;
        //     console.log('test cookie');
        //     console.log(vm.type);
        // }


        vm.update = function() {
            // vm.type = $cookies.get('type');
            // console.log('2.test cookie');
            // console.log(vm.type);
            if (authServices.getToken() && authServices.getUserInfo().usertype === 'User') {
                vm.showLead = true;
                vm.showFinder = true;
                vm.showAccount = true;
                vm.showUser = false;
                vm.showDatabase = false;

            } else if (authServices.getToken() && authServices.getUserInfo().usertype === 'Admin') {
                vm.showLead = true;
                vm.showFinder = true;
                vm.showAccount = true;
                vm.showUser = true;
                vm.showDatabase = false;

            } else if (authServices.getToken() && authServices.getUserInfo().usertype === 'SuperAdmin') {
                vm.showLead = false;
                vm.showFinder = false;
                vm.showAccount = false;
                vm.showUser = false;
                vm.showDatabase = true;
            }

            console.log(vm.showLead);
            console.log(vm.showFinder);
            console.log(vm.showAccount);
            console.log(vm.showUser);
            console.log(vm.showDatabase);
            console.log(vm.showLogout);
        }

        // vm.logout = function() {
        //     vm.showLead = false;
        //     vm.showFinder = false;
        //     vm.showAccount = false;
        //     vm.showUser = false;
        //     vm.showDatabase = false;
        //     $cookies.remove('type');
        //     console.log('remove');
        // }

        vm.logout = function() {
            vm.showLead = false;
            vm.showFinder = false;
            vm.showAccount = false;
            vm.showUser = false;
            vm.showDatabase = false;

            console.log('logout');
            console.log(vm.showLead);
            console.log(vm.showFinder);
            console.log(vm.showAccount);
            console.log(vm.showUser);
            console.log(vm.showDatabase);
            console.log(vm.showLogout);
            // $cookies.remove('userTypeCookie');
            // authServices.deleteToken();
            authServices.logout();
        }
    }
]);