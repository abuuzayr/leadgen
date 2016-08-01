(function() {
    'use strict';
    app.controller('consumerScrapController', ['$scope', 'consumerLeads', 'consumerShareData', '$http', 'uiGridConstants', '$q', '$location', '$timeout', '$interval', 'consumerShareInput',
        function($scope, consumerLeads, consumerShareData, $http, uiGridConstants, $q, $location, $timeout, $interval, consumerShareInput) {

            var cs = this;

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

            cs.gridOptions = {
                enableSorting: true,
                enableFiltering: true,
                data: [],
                columnDefs: [{
                    field: 'firstName',
                    displayName: 'First Name',
                    headerCellClass: cs.highlightFilteredHeader
                }, {
                    field: 'lastName',
                    displayName: 'Last Name',
                    headerCellClass: cs.highlightFilteredHeader
                }, {
                    field: 'email',
                    displayName: 'Email',
                    headerCellClass: cs.highlightFilteredHeader
                }, {
                    field: 'company',
                    displayName: 'Company',
                    headerCellClass: cs.highlightFilteredHeader
                }, {
                    field: 'phone',
                    displayName: 'Phone No.',
                    headerCellClass: cs.highlightFilteredHeader
                }, {
                    field: 'category',
                    displayName: 'Category',
                    headerCellClass: cs.highlightFilteredHeader
                }, ],
                onRegisterApi: function(gridApi) {
                    cs.gridApi = gridApi;
                }
            };

            /** To show loading effect (spinner) based on the different status */
            cs.spinner = false;
            cs.playStatus = function() {
                cs.spinner = true;
            };
            cs.pauseStatus = function() {
                cs.spinner = false;
            };
            cs.stopStatus = function() {
                cs.spinner = false;
            };

            //filter for ui-grid
            cs.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
                if (col.filters[0].term) {
                    return 'header-filtered';
                } else {
                    return '';
                }
            };

            cs.dataList = [];
            cs.numScrap = 0;
            cs.messageNoScrap = "No more websites available";

            // get the previously selected category
            cs.category = consumerShareInput.getCategory();

            /** Gets leads from database and stores the leads obtained in a array */
            consumerLeads.getConsumerLeads(cs.category)
                .then(function successCallback(res) {
                    cs.dataList = res.data;
                }),
                function errorCallback(err) {
                    console.log('err is ' + err);
                };

            var stop;
            var count = 0;

            /**
             * Push and pop the leads to UI Grid table from array at intervals
             * Will pause scraping if there is no internet connection
             * If there is internet connection and leads in the array, the push and pop process will occur
             */
            cs.transfer = function() {
                if (angular.isDefined(stop)) {
                    return;

                } else if (navigator.onLine === false) {
                    // console.log('2.the server is ' + navigator.onLine);
                    gc.pauseScraping();

                } else if (navigator.onLine === true) {
                    showInternet(navigator.onLine);

                    stop = $interval(function() {
                        if (cs.dataList.length > 0) {
                            var popLead = cs.dataList.pop();
                            cs.gridOptions.data.push(popLead);
                            cs.numScrap = cs.gridOptions.data.length;
                            consumerShareData.addLead(popLead);

                            // if there is no internet connection, stop scraping, ask for internet
                        } else if (navigator.onLine === false) {
                            // console.log('3.the server is ' + navigator.onLine);
                            gc.pauseScraping();
                            showInternet(navigator.onLine);

                        } else {
                            cs.stopScraping();
                            cs.showFunction();
                        }
                    }, 2000);
                }
            };

            /** Pause scraping and hide loading effect */
            cs.pauseScraping = function() {
                if (angular.isDefined(stop)) {
                    $interval.cancel(stop);
                    stop = undefined;
                }
                cs.spinner = false;
            };

            /** Stop scraping process, hides loading effect, shows 'Results' button*/
            cs.pressStop = false;
            cs.stopScraping = function() {
                if (angular.isDefined(stop)) {
                    $interval.cancel(stop);
                    cs.pressStop = true;
                }
                cs.spinner = false;
            };

            cs.showResult = false;
            cs.showFunction = function() {
                cs.showResult = true;
            };

            //online = true, offline = false
            var checkOnline = navigator.onLine;
            cs.status = false;

            var showInternet = function(checkOnline) {
                if (checkOnline === true) {
                    cs.status = false;
                } else if (checkOnline === false) {
                    cs.status = true;
                }
            };

        }
    ]);
})();