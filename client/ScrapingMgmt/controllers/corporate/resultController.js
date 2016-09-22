(function() {
    'use strict';
    app.controller('resultController', ['$scope', 'shareData', 'sendResults', '$http', 'uiGridConstants', '$q', '$location', '$timeout', 'feedbackServices',
        function($scope, shareData, sendResults, $http, uiGridConstants, $q, $location, $timeout, feedbackServices) {

            var rc = this;
            rc.gridOptions = {
                enableSorting: true,
                enableFiltering: true,
                data: [],
                columnDefs: [{
                    field: 'firstName',
                    displayName: 'First Name',
                    headerCellClass: rc.highlightFilteredHeader
                }, {
                    field: 'lastName',
                    displayName: 'Last Name',
                    headerCellClass: rc.highlightFilteredHeader
                }, {
                    field: 'email',
                    displayName: 'Email',
                    minWidth: 200,
                    headerCellClass: rc.highlightFilteredHeader
                }, {
                    field: 'company',
                    displayName: 'Company',
                    headerCellClass: rc.highlightFilteredHeader
                }, {
                    field: 'phone',
                    displayName: 'Phone No.',
                    headerCellClass: rc.highlightFilteredHeader
                }, {
                    field: 'category',
                    displayName: 'Category',
                    headerCellClass: rc.highlightFilteredHeader
                }, ],
                onRegisterApi: function(gridApi) {
                    rc.gridApi = gridApi;
                }
            };

            //get the previously scraped leads and display in the UI Grid table
            rc.gridOptions.data = shareData.getData();
            rc.resultsLength = rc.gridOptions.data.length;

            //filter for ui-grid
            rc.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
                if (col.filters[0].term) {
                    return 'header-filtered';
                } else {
                    return '';
                }
            };

            rc.showResult = false;

            rc.showFunction = function() {
                rc.showResult = true;
                $timeout(function() {
                    rc.showResult = false;
                }, 1500);
            };

            /** Delete the selected leads from table */
            rc.deleteSelected = function() {
                angular.forEach(rc.gridApi.selection.getSelectedRows(), function(data, index) {
                    rc.gridOptions.data.splice(rc.gridOptions.data.lastIndexOf(data), 1);
                    rc.resultsLength -= 1;
                });
            };

            rc.responseMessage = "";
            rc.symbol = true;

            /** Clear leads from the result table once the user is done with scraping */
            rc.clearData = function() {
                // rc.gridOptions.data = [];
                // rc.resultsLength = 0;
                shareData.clearData();
            };

            var dataToContacts = [];

            /** Add the selected leads to a array */
            rc.addSelected = function() {
                dataToContacts = [];
                angular.forEach(rc.gridApi.selection.getSelectedRows(), function(data, index) {
                    dataToContacts.push(data);

                    // callback();
                });
            };

            /** 
             * Save the selected leads to lead list
             * sendLeads - updates database
             */
            rc.saveToContacts = function() {
                var myJsonString;

                // if none selected, save all
                if (dataToContacts.length === 0) {
                    myJsonString = angular.toJson(rc.gridOptions.data);
                } else {
                    //save the selected contacts
                    myJsonString = angular.toJson(dataToContacts);
                }

                sendResults.sendLeads(myJsonString).then(function successCallback(res) {
                        rc.responseMessage = "Saved to Contacts!";
                        // successFeedback("Saved to Contacts!", 5000);
                    })
                    .catch(function errorCallback(err) {
                        rc.responseMessage = "Error Occured";
                        rc.symbol = false;
                        // errorFeedback('Unable to save to contacts');
                    });
            };

            //Open popup dialog box
            rc.openDialog = function(dialogName) {
                var dialog = document.querySelector('#' + dialogName);
                if (!dialog.showModal) {
                    dialogPolyfill.registerDialog(dialog);
                }
                dialog.showModal();
            };

            //Close popup dialog box
            rc.closeDialog = function(dialogName) {
                var dialog = document.querySelector('#' + dialogName);
                dialog.close();
            };

            var successFeedback = function(msg, timeout) {
                return feedbackServices.successFeedback(msg, '#corporateResult-feedbackMessage', timeout);
            };

            var errorFeedback = function(errData, timeout) {
                return feedbackServices.errorFeedback(errData, '#corporateResult-feedbackMessage');
            };
        }
    ]);
})();