angular
    .module("app")
    .controller("tabsController", ['authServices', '$scope', function(authServices, $scope) {
        var vm = this;
        vm.showCorporate = true;
        vm.showConsumer = true;

        if (authServices.getToken() && authServices.getUserInfo().subType.consumer === false) {
            vm.showConsumer = false;
            console.log(vm.showCorporate);
        } else if (authServices.getToken() && authServices.getUserInfo().subType.corporate === false) {
            vm.showCorporate = false;
            console.log(vm.showConsumer);
        }

    }]);