app.controller('beforeScrapeController', ['$scope', '$http', 'uiGridConstants', '$q', '$location', '$timeout', 'shareInput', 'sendCountry',
    function($scope, $http, uiGridConstants, $q, $location, $timeout, shareInput, sendCountry) {

        var beforeCorporate = this;

        beforeCorporate.category = "";
        beforeCorporate.country = "Singapore";

        beforeCorporate.listOfCountry;
        //get country data
        sendCountry.success(function(data) {
            beforeCorporate.listOfCountry = data;
        });

        beforeCorporate.setInput = function() {
            shareInput.setCategory(beforeCorporate.category);
            shareInput.setCountry(beforeCorporate.country);
        };

        beforeCorporate.continue = true;
        beforeCorporate.continueScraping = function() {
            if (angular.isDefined(beforeCorporate.category)) {
                beforeCorporate.continue = false;
            }
        };
    }
]);