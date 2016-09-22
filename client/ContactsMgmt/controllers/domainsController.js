(function() {
    'use strict';
    app.controller('domainsController', ['$scope', 'appConfig', '$window', 'domainsData', '$http', '$interval', 'uiGridConstants', '$q', '$location', '$timeout',
        function($scope, appConfig, $window, domainsData, $http, $interval, uiGridConstants, $q, $location, $timeout) {

            var dc = this;

            /** Get the blocked domains from database */
            domainsData.success(function(data) {
                dc.gridOptions.data = data;
            });

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

            dc.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
                if (col.filters[0].term) {
                    return 'header-filtered';
                } else {
                    return '';
                }
            };

            /** UI Grid for blocked domains */
            dc.gridOptions = {
                showGridFooter: true,
                enableFiltering: true,
                enableSorting: true,
                minRowsToShow: 4,
                columnDefs: [{
                    field: 'domain',
                    displayName: 'Domain',
                    enableCellEdit: true,
                    headerCellClass: dc.highlightFilteredHeader
                }],
            };

            /** 
             * This method refreshes the page. 
             * It is used to update the data shown in UI-Grid
             */
            var refresh = function() {
                $window.location.reload();
            };

            /** 
             * Adds a new domain into the UI-Grid
             * http.post - adds the new domain to the database and refresh the page
             * @param {Object} domain 
             * */
            dc.addDomain = function() {
                var domain = dc.domainSelected;
                var arrName = domain.split(" ");
                var editedDomain = "";
                for (var x of arrName) {
                    if (x !== "") {
                        editedDomain += x;
                    }
                }
                dc.gridOptions.data.push({
                    "domain": editedDomain
                });

                var domain = {
                    "domain": editedDomain
                };
                var url = "/contacts/blackList/domain";
                $http.post(appConfig.API_URL + url, domain)
                    .then(function(res) {
                        refresh();
                    });
            };

            /**
             * This method creates a new variable to store the data of the domain to be deleted. 
             * It is retrieve using ng-model. 
             * This method is called so as to facilitate the confirmation of delete via popup dialog.
             */
            dc.selectDeleteDomain = function() {
                dc.selectedDeleteDomain = dc.domainSelected;
            };

            /**
             * This method deletes a domain based on the data binded to the variable created when 
             * selectDeleteDomain() method is called.
             * http.put - deletes domain from database and refreshes page if successful
             */
            dc.deleteDomain = function() {
                for (var x in dc.gridOptions.data) {
                    if ((dc.gridOptions.data[x].domain === dc.selectedDeleteDomain)) {
                        var domain = dc.gridOptions.data.splice(x, 1);
                        var url = "/contacts/blackList/domain";
                        deleteStatus = $http.put(appConfig.API_URL + url, domain[0]);
                        refresh();
                    }
                }
            };

            dc.gridOptions.onRegisterApi = function(gridApi) {
                dc.gridApi = gridApi;
            };

            //popup dialog box
            dc.openDialog = function(dialogName) {
                var dialog = document.querySelector('#' + dialogName);
                if (!dialog.showModal) {
                    dialogPolyfill.registerDialog(dialog);
                }
                dialog.showModal();
            };

            dc.closeDialog = function(dialogName) {
                var dialog = document.querySelector('#' + dialogName);
                dialog.close();
            };

        }
    ]);
})();