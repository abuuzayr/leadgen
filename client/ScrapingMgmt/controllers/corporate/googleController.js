app.controller('googleController', ['$scope', 'googleResults', 'ypResults', 'shareData', 'sendCountry', '$http', 'uiGridConstants', '$q', '$location', '$timeout', '$interval', 'shareInput',
    function($scope, googleResults, ypResults, shareData, sendCountry, $http, uiGridConstants, $q, $location, $timeout, $interval, shareInput) {

        var gc = this;
        /* =========================================== Load animation =========================================== */
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

        /* =========================================== Scrape =========================================== */

        gc.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            data: [],
            columnDefs: [{
                field: 'firstName',
                displayName: 'First Name',
                headerCellClass: gc.highlightFilteredHeader
            }, {
                field: 'lastName',
                displayName: 'Last Name',
                headerCellClass: gc.highlightFilteredHeader
            }, {
                field: 'email',
                displayName: 'Email',
                headerCellClass: gc.highlightFilteredHeader
            }, {
                field: 'company',
                displayName: 'Company',
                headerCellClass: gc.highlightFilteredHeader
            }, {
                field: 'phone',
                displayName: 'Phone No.',
                headerCellClass: gc.highlightFilteredHeader
            }, {
                field: 'category',
                displayName: 'Category',
                headerCellClass: gc.highlightFilteredHeader
            }, ],
            onRegisterApi: function(gridApi) {
                gc.gridApi = gridApi;
            }
        };

        //filter for ui-grid
        gc.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        };

        /** To show loading effect (spinner) based on the different status */
        gc.spinner = false;
        gc.playStatus = function() {
            gc.spinner = true;
        };
        gc.pauseStatus = function() {
            gc.spinner = false;
        };
        gc.stopStatus = function() {
            gc.spinner = false;
        };

        // to show scraping page
        // gc.showScrape = false;
        // gc.showScrapeAfterClick = function() {
        //     gc.showScrape = true;
        // };

        // get the previously selected category & country
        gc.category = shareInput.getCategory();
        gc.country = shareInput.getCountry();

        gc.dataListForGoogle = [];
        gc.dataListForYP = [];
        gc.numScrap = 0;
        gc.messageNoScrap = "No more websites available";


        /** 
         * Gets leads from Google when user scrapes for the first time
         * Stores the leads obtained in a array
         */
        googleResults.firstTimeScrape(gc.category, gc.country)
            .then(function successCallback(res) {
                console.log('first time scrape')
                gc.dataListForGoogle = res.data;
            }),
            function errorCallback(err) {
                // console.log('err is ' + err);
                console.log('error for first time scrape');
            };

        /** 
         * Gets leads from database
         * Stores the leads obtained in a array
         */
        ypResults.scrapeYellowPageLeads(gc.category)
            .then(function successCallback(res) {
                gc.dataListForYP = res.data;

            }),
            function errorCallback(err) {
                // console.log('err is ' + err);
            };

        var stop;
        var count = 0;

        /**
         * Push and pop the leads to UI Grid table from array at intervals
         * Will pause scraping if there is no internet connection
         * If there is internet connection and leads in the array, the push and pop process will occur
         * Will request for more leads from database if all the leads are scraped
         */
        gc.transfer = function() {
            console.log('Start scraping');
            // console.log('the server is ' + navigator.onLine);
            if (angular.isDefined(stop)) {
                return;

            } else if (navigator.onLine === false) {
                // console.log('2.the server is ' + navigator.onLine);
                gc.pauseScraping();

            } else if (navigator.onLine === true) {

                showInternet(navigator.onLine); //to make gc.status

                stop = $interval(function() {
                    if (gc.dataListForGoogle.length > 0 && navigator.onLine === true) {
                        var popLead = gc.dataListForGoogle.pop();
                        gc.gridOptions.data.push(popLead);
                        gc.numScrap = gc.gridOptions.data.length;
                        shareData.addLead(popLead); // store the scraped leads to another array to display in the results

                    } else if (gc.dataListForYP.length > 0 && navigator.onLine === true) {
                        var popYPLead = gc.dataListForYP.pop();
                        gc.gridOptions.data.push(popYPLead);
                        gc.numScrap = gc.gridOptions.data.length;
                        shareData.addLead(popYPLead);

                        // if there is no internet connection, stop scraping and request for internet connection
                    } else if (navigator.onLine === false) {
                        gc.pauseScraping();
                        showInternet(navigator.onLine);
                    } else {
                        googleResults.continueScrape(gc.category, gc.country).then(function successCallback(res) {
                                // signal to stop scraping as there are no more leads
                                if (angular.isDefined(res.data.status) && res.data.status === 205) {
                                    gc.stopScraping();
                                    gc.showFunction(); //show the 'view results' button
                                } else if (angular.isDefined(res.data.status)) {
                                    gc.stopScraping();
                                    gc.showFunction();
                                } else {
                                    gc.dataListForGoogle = res.data;
                                }
                            }),
                            function errorCallback(err) {
                                // console.log('err is ' + err);
                                gc.stopScraping();
                                gc.showFunction(); //show the 'view results' button
                            };
                    }
                }, 2000);
            }
        };

        /** Pause scraping and hide loading effect */
        gc.pauseScraping = function() {
            if (angular.isDefined(stop) /*&& stop !== 1*/ ) {
                $interval.cancel(stop);
                stop = undefined;
            }
            gc.spinner = false;
        };

        /** Stop scraping process, hides loading effect, shows 'Results' button*/
        gc.pressStop = false;
        gc.stopScraping = function() {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                gc.pressStop = true;
            }
            gc.spinner = false;
        };

        gc.showResult = false;
        gc.showFunction = function() {
            gc.showResult = true;
        };

        //online = true, offline = false
        var checkOnline = navigator.onLine;
        gc.status = false;

        var showInternet = function(checkOnline) {
            if (checkOnline === true) {
                gc.status = false;
            } else if (checkOnline === false) {
                gc.status = true;
            }
        };
    }
]);