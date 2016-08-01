(function() {
    'use strict';
    app.controller('beforeConsumerController', ['$scope', '$http', 'uiGridConstants', '$q', '$location', '$timeout', 'consumerShareInput',
        function($scope, $http, uiGridConstants, $q, $location, $timeout, consumerShareInput) {

            var beforeConsumer = this;

            beforeConsumer.category = "";

            /** Gets the category that user selects */
            beforeConsumer.setInput = function() {
                consumerShareInput.setCategory(beforeConsumer.category);
            };

            /** To disable 'Proceed to scrape' button until category is choosen */
            beforeConsumer.continue = true;
            beforeConsumer.continueScraping = function() {
                if (angular.isDefined(beforeConsumer.category)) {
                    beforeConsumer.continue = false;
                }
            };
        }
    ]);
})();