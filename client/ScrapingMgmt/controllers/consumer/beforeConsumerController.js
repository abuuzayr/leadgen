app.controller('beforeConsumerController', ['$scope', '$http', 'uiGridConstants', '$q', '$location', '$timeout', 'consumerShareInput',
    function($scope, $http, uiGridConstants, $q, $location, $timeout, consumerShareInput) {

        var beforeConsumer = this;

        beforeConsumer.category = "";

        beforeConsumer.setInput = function() {
            consumerShareInput.setCategory(beforeConsumer.category);
        };

        beforeConsumer.continue = true;
        beforeConsumer.continueScraping = function() {
            if (angular.isDefined(beforeConsumer.category)) {
                beforeConsumer.continue = false;
            }
        };
    }
]);