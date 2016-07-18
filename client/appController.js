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
            if (authServices.getToken() && authServices.getUserInfo().usertype === 'user') {
                vm.showLead = true;
                vm.showFinder = true;
                vm.showAccount = true;
                vm.showUser = false;
                vm.showDatabase = false;

            } else if (authServices.getToken() && authServices.getUserInfo().usertype === 'admin') {
                vm.showLead = true;
                vm.showFinder = true;
                vm.showAccount = true;
                vm.showUser = true;
                vm.showDatabase = false;

            } else if (authServices.getToken() && authServices.getUserInfo().usertype === 'superadmin') {
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
            authServices.logout();
        }

        // vm.showLead = userService.getShowLead();
        // if (vm.showLead === '') {
        //     vm.showLead = false;
        // }
        // console.log(vm.showLead);

        // vm.showFinder = userService.getShowFinder();
        // if (vm.showFinder === '') {
        //     vm.showFinder = false;
        // }
        // console.log(vm.showFinder);

        // vm.showAccount = userService.getShowAccount();
        // if (vm.showAccount === '') {
        //     vm.showAccount = false;
        // }
        // console.log(vm.showAccount);

        // vm.showUser = userService.getShowUser();
        // if (vm.showUser === '') {
        //     vm.showUser = false;
        // }
        // console.log(vm.showUser);

        // vm.showDatabase = userService.getShowDatabase();
        // if (vm.showDatabase === '') {
        //     vm.showDatabase = false;
        // }
        // console.log(vm.showDatabase);

        // vm.showBar = userService.getShowBar();
        // if (vm.showBar === '') {
        //     vm.showBar = true;
        // }

        // vm.update = function() {
        //     vm.type = userService.getType();
        //     console.log(vm.type);
        //     vm.showLead = userService.getShowLead();
        //     vm.showFinder = userService.getShowFinder();
        //     vm.showAccount = userService.getShowAccount();
        //     vm.showUser = userService.getShowUser();
        //     vm.showDatabase = userService.getShowDatabase();

        //     if (vm.showLead === '') {
        //         vm.showLead = false;
        //     }

        //     if (vm.showFinder === '') {
        //         vm.showFinder = false;
        //     }

        //     if (vm.showAccount === '') {
        //         vm.showAccount = false;
        //     }
        //     if (vm.showUser === '') {
        //         vm.showUser = false;
        //     }
        //     if (vm.showDatabase === '') {
        //         vm.showDatabase = false;
        //     }

        //     console.log(vm.showLead);
        //     console.log(vm.showFinder);
        //     console.log(vm.showAccount);
        //     console.log(vm.showUser);
        //     console.log(vm.showDatabase);
        // }

        // vm.hideBar = function() {
        //     vm.showBar = false;
        // }
    }
]);