app.controller('beforeScrapeController', ['$scope', '$http', 'uiGridConstants', '$q', '$location', '$timeout', 'shareInput', 'sendCountry',
    function($scope, $http, uiGridConstants, $q, $location, $timeout, shareInput, sendCountry) {

        var beforeCorporate = this;

        beforeCorporate.category = "";
        //default country is Singapore
        beforeCorporate.country = "Singapore";

        beforeCorporate.listOfCountry;
        /** Gets the list of country*/
        sendCountry.success(function(data) {
            beforeCorporate.listOfCountry = data;
        });

        /** Gets the category and country selected by the user*/
        beforeCorporate.setInput = function() {
            shareInput.setCategory(beforeCorporate.category);
            shareInput.setCountry(beforeCorporate.country);
        };

        /** To disable 'Proceed to scrape' button until category is choosen */
        beforeCorporate.continue = true;
        beforeCorporate.continueScraping = function() {
            if (angular.isDefined(beforeCorporate.category)) {
                beforeCorporate.continue = false;
            }
        };
    }
]);