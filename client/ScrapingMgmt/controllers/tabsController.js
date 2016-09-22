(function() {
    'use strict';
    angular
        .module("app")
        .controller("tabsController", ['authServices', '$scope', function(authServices, $scope) {
            var vm = this;
            vm.showCorporate = false;
            vm.showConsumer = false;

            if (authServices.getToken() && authServices.getUserInfo().subType.consumer === true) {
                vm.showConsumer = true;
            }

            if (authServices.getToken() && authServices.getUserInfo().subType.corporate === true) {
                vm.showCorporate = true;
            }

        }]);
})();