(function() {
    'use strict';
    app.controller('navBarController', ['$scope', '$q', '$location', '$timeout', '$cookies', 'authServices',
        function($scope, $q, $location, $timeout, $cookies, authServices) {

            var vm = this;
            vm.showLogout = false;

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

                var url = window.location.href;
                var lastPart = url.split("/").pop();
                console.log(lastPart);
                if (lastPart == 'lead-finder' || lastPart == 'corporate' || lastPart == 'consumer') {
                    vm.leadMgmtStyle = { "font-weight": "400" }
                    vm.leadFinderStyle = { "font-weight": "900" }
                    vm.accountSettingsStyle = { "font-weight": "400" }
                    vm.userMgmtStyle = { "font-weight": "400" }
                    vm.databaseMgmtStyle = { "font-weight": "400" }
                } else if (lastPart == 'leadlist' || lastPart == 'maillist' || lastPart == 'blacklist') {
                    vm.leadMgmtStyle = { "font-weight": "900" }
                    vm.leadFinderStyle = { "font-weight": "400" }
                    vm.accountSettingsStyle = { "font-weight": "400" }
                    vm.userMgmtStyle = { "font-weight": "400" }
                    vm.databaseMgmtStyle = { "font-weight": "400" }
                } else if (lastPart == 'profile') {
                    vm.leadMgmtStyle = { "font-weight": "400" }
                    vm.leadFinderStyle = { "font-weight": "400" }
                    vm.accountSettingsStyle = { "font-weight": "900" }
                    vm.userMgmtStyle = { "font-weight": "400" }
                    vm.databaseMgmtStyle = { "font-weight": "400" }
                } else if (lastPart == 'externalDatabase') {
                    vm.leadMgmtStyle = { "font-weight": "400" }
                    vm.leadFinderStyle = { "font-weight": "400" }
                    vm.accountSettingsStyle = { "font-weight": "400" }
                    vm.userMgmtStyle = { "font-weight": "400" }
                    vm.databaseMgmtStyle = { "font-weight": "900" }
                } else {
                    vm.leadMgmtStyle = { "font-weight": "400" }
                    vm.leadFinderStyle = { "font-weight": "400" }
                    vm.accountSettingsStyle = { "font-weight": "400" }
                    vm.userMgmtStyle = { "font-weight": "400" }
                    vm.databaseMgmtStyle = { "font-weight": "400" }
                }

                // console.log(vm.showLead);
                // console.log(vm.showFinder);
                // console.log(vm.showAccount);
                // console.log(vm.showUser);
                // console.log(vm.showDatabase);
                // console.log(vm.showLogout);
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
})();