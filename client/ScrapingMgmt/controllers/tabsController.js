(function() {
    'use strict';
    angular
        .module("app")
        .controller("tabsController", ['authServices', '$scope', function(authServices, $scope) {
            var vm = this;
            vm.showCorporate = true;
            vm.showConsumer = true;
            console.log(authServices.getUserInfo().subType);

            if (authServices.getToken() && authServices.getUserInfo().subType.consumer === true) {
                vm.showConsumer = false;
            }

            if (authServices.getToken() && authServices.getUserInfo().subType.corporate === true) {
                vm.showCorporate = false;
            }

        }]);
})();