angular
    .module("app")
    .controller("tabsController", ['authServices', '$scope', function(authServices, $scope) {
        var vm = this;
        vm.showCorporate = false;
        vm.showConsumer = false;
        console.log(authServices.getUserInfo().subType);

        if (authServices.getToken() && authServices.getUserInfo().subType.consumer === true) {
            vm.showConsumer = true;
            console.log(vm.showCorporate);
        } else if (authServices.getToken() && authServices.getUserInfo().subType.corporate === true) {
            vm.showCorporate = true;
            console.log(vm.showConsumer);
        }

    }]);