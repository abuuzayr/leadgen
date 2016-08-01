(function() {
    'use strict';
    app.controller('consumerResultController', ['$scope', 'consumerShareData', 'sendResults', '$http', 'uiGridConstants', '$q', '$location', '$timeout', '$interval',
        function($scope, consumerShareData, sendResults, $http, uiGridConstants, $q, $location, $timeout) {

            var cr = this;

            cr.gridOptions = {
                enableSorting: true,
                enableFiltering: true,
                minRowsToShow: 10,
                data: [],
                columnDefs: [
                    { field: 'firstName', displayName: 'First Name', headerCellClass: cr.highlightFilteredHeader },
                    { field: 'lastName', displayName: 'Last Name', headerCellClass: cr.highlightFilteredHeader },
                    { field: 'email', displayName: 'Email', headerCellClass: cr.highlightFilteredHeader },
                    { field: 'company', displayName: 'Company', headerCellClass: cr.highlightFilteredHeader },
                    { field: 'phone', displayName: 'Phone No.', headerCellClass: cr.highlightFilteredHeader },
                    { field: 'category', displayName: 'Category', headerCellClass: cr.highlightFilteredHeader },
                ],
                onRegisterApi: function(gridApi) {
                    cr.gridApi = gridApi;
                }
            };

            //get the previously scraped leads and display in the UI Grid table
            cr.gridOptions.data = consumerShareData.getData();
            cr.resultsLength = cr.gridOptions.data.length;

            //filter for ui-grid
            cr.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
                if (col.filters[0].term) {
                    return 'header-filtered';
                } else {
                    return '';
                }
            };

            cr.showResult = false;

            cr.showFunction = function() {
                cr.showResult = true;
                $timeout(function() {
                    cr.showResult = false;
                }, 1500);
            };

            /** Delete the selected leads from table */
            cr.deleteSelected = function() {
                angular.forEach(cr.gridApi.selection.getSelectedRows(), function(data, index) {
                    cr.gridOptions.data.splice(cr.gridOptions.data.lastIndexOf(data), 1);
                    cr.resultsLength -= 1;
                });
            };

            cr.responseMessage = "";
            cr.symbol = true;

            /** Clear leads from the result table once the user is done with scraping */
            cr.clearData = function() {
                consumerShareData.clearData();
            };

            var dataToContacts = [];

            /** Add the selected leads to a array */
            cr.addSelected = function() {
                dataToContacts = [];
                angular.forEach(cr.gridApi.selection.getSelectedRows(), function(data, index) {
                    dataToContacts.push(data);
                    console.log('1.selected data is ' + dataToContacts);
                    console.log('2.data is ' + data);

                    // callback();
                });
            };

            /** 
             * Save the selected leads to lead list
             * sendLeads - updates database
             */
            cr.saveToContacts = function() {
                var myJsonString;
                console.log('3.selected data is ' + dataToContacts);

                // if none selected, save all
                if (dataToContacts.length === 0) {
                    myJsonString = angular.toJson(cr.gridOptions.data);
                } else {
                    //save the selected contacts
                    myJsonString = angular.toJson(dataToContacts);
                }

                sendResults.sendLeads(myJsonString).then(function successCallback(res) {
                        cr.responseMessage = "Saved to Contacts!";
                    }),
                    function errorCallback(err) {
                        cr.responseMessage = "Error Occured";
                        cr.symbol = false;
                    };
            };

            //Open popup dialog box
            cr.openDialog = function(dialogName) {
                var dialog = document.querySelector('#' + dialogName);
                if (!dialog.showModal) {
                    dialogPolyfill.registerDialog(dialog);
                }
                dialog.showModal();
            };

            //Close popup dialog box
            cr.closeDialog = function(dialogName) {
                var dialog = document.querySelector('#' + dialogName);
                dialog.close();
            };
        }
    ]);
})();