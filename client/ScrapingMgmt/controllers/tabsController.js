angular
    .module("app")
    .controller("tabsController", ['authServices', '$scope', function(authServices, $scope) {
        var vm = this;
        vm.showCorporate = true;
        vm.showConsumer = true;

        if (authServices.getToken() && authServices.getUserInfo().subscriptionType.consumer === false) {
            vm.showConsumer = false;
        } else if (authServices.getToken() && authServices.getUserInfo().subscriptionType.corporate === false) {
            vm.showCorporate = false;
        }
    }]);