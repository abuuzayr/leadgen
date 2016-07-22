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

            var url = window.location.href ;
            var lastPart = url.split("/").pop();
            console.log(lastPart);
            if(lastPart=='lead-finder'){
                console.log("aaa");
                vm.leadMgmtStyle={"font-weight":"normal"}
                vm.leadFinderStyle={"font-weight":"bold"}
                vm.accountSettingsStyle={"font-weight":"normal"}
                vm.userMgmtStyle={"font-weight":"normal"}
                vm.databaseMgmtStyle={"font-weight":"normal"}

            }else if(lastPart=='leadlist'){
                console.log("bbbb");
                vm.leadMgmtStyle={"font-weight":"bold"}
                vm.leadFinderStyle={"font-weight":"normal"}
                vm.accountSettingsStyle={"font-weight":"normal"}
                vm.userMgmtStyle={"font-weight":"normal"}
                vm.databaseMgmtStyle={"font-weight":"normal"}

            }else if(lastPart=='profile'){
                console.log("ccc");
                vm.leadMgmtStyle={"font-weight":"normal"}
                vm.leadFinderStyle={"font-weight":"normal"}
                vm.accountSettingsStyle={"font-weight":"bold"}
                vm.userMgmtStyle={"font-weight":"normal"}
                vm.databaseMgmtStyle={"font-weight":"normal"}

            }else if(lastPart=='externalDatabase'){
                console.log("ddddd");
                vm.leadMgmtStyle={"font-weight":"normal"}
                vm.leadFinderStyle={"font-weight":"normal"}
                vm.accountSettingsStyle={"font-weight":"normal"}
                vm.userMgmtStyle={"font-weight":"normal"}
                vm.databaseMgmtStyle={"font-weight":"bold"}

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