app.controller('appController', ['$scope', '$q', '$location', '$timeout', 'userService', '$cookies', 'authServices',
    function($scope, $q, $location, $timeout, userService, $cookies, authServices) {

        var vm = this;
        vm.showLogout = false;

        if (authServices.getToken() && authServices.getUserInfo().usertype === 'User') {
            vm.showLead = true;
            vm.showFinder = true;
            vm.showAccount = true;
            vm.showUser = false;
            vm.showDatabase = false;
            vm.showLogout = true;

            console.log(vm.showLead);
            console.log(vm.showFinder);
            console.log(vm.showAccount);
            console.log(vm.showUser);
            console.log(vm.showDatabase);
            console.log(vm.showLogout);

        } else if (authServices.getToken() && authServices.getUserInfo().usertype === 'Admin') {
            vm.showLead = true;
            vm.showFinder = true;
            vm.showAccount = true;
            vm.showUser = true;
            vm.showDatabase = false;
            vm.showLogout = true;

            console.log(vm.showLead);
            console.log(vm.showFinder);
            console.log(vm.showAccount);
            console.log(vm.showUser);
            console.log(vm.showDatabase);
            console.log(vm.showLogout);

        } else if (authServices.getToken() && authServices.getUserInfo().usertype === 'SuperAdmin') {
            vm.showLead = false;
            vm.showFinder = false;
            vm.showAccount = false;
            vm.showUser = false;
            vm.showDatabase = true;
            vm.showLogout = true;

            console.log(vm.showLead);
            console.log(vm.showFinder);
            console.log(vm.showAccount);
            console.log(vm.showUser);
            console.log(vm.showDatabase);
            console.log(vm.showLogout);
        }


        vm.update = function() {

            if (authServices.getToken() && authServices.getUserInfo().usertype === 'User') {
                vm.showLead = true;
                vm.showFinder = true;
                vm.showAccount = true;
                vm.showUser = false;
                vm.showDatabase = false;
                vm.showLogout = true;

            } else if (authServices.getToken() && authServices.getUserInfo().usertype === 'Admin') {
                vm.showLead = true;
                vm.showFinder = true;
                vm.showAccount = true;
                vm.showUser = true;
                vm.showDatabase = false;
                vm.showLogout = true;

            } else if (authServices.getToken() && authServices.getUserInfo().usertype === 'SuperAdmin') {
                vm.showLead = false;
                vm.showFinder = false;
                vm.showAccount = false;
                vm.showUser = false;
                vm.showDatabase = true;
                vm.showLogout = true;
            }

            console.log(vm.showLead);
            console.log(vm.showFinder);
            console.log(vm.showAccount);
            console.log(vm.showUser);
            console.log(vm.showDatabase);
            console.log(vm.showLogout);
        };

        vm.update();

        vm.logout = function() {
            vm.showLead = false;
            vm.showFinder = false;
            vm.showAccount = false;
            vm.showUser = false;
            vm.showDatabase = false;
            vm.showLogout = false;
            authServices.logout();
        };

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