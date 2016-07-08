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
                minWidth: 80,
                width: 150,
                headerCellClass: rc.highlightFilteredHeader
            }, {
                field: 'lastName',
                displayName: 'Last Name',
                minWidth: 80,
                width: 150,
                headerCellClass: rc.highlightFilteredHeader
            }, {
                field: 'email',
                displayName: 'Email',
                minWidth: 80,
                width: 200,
                headerCellClass: rc.highlightFilteredHeader
            }, {
                field: 'company',
                displayName: 'Company',
                minWidth: 80,
                width: 150,
                headerCellClass: rc.highlightFilteredHeader
            }, {
                field: 'phone',
                displayName: 'Phone No.',
                minWidth: 80,
                width: 150,
                headerCellClass: rc.highlightFilteredHeader
            }, {
                field: 'category',
                displayName: 'Category',
                minWidth: 80,
                width: 150,
                headerCellClass: rc.highlightFilteredHeader
            }, ],
            onRegisterApi: function(gridApi) {
                rc.gridApi = gridApi;
            }
        };

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

        rc.deleteSelected = function() {
            angular.forEach(rc.gridApi.selection.getSelectedRows(), function(data, index) {
                rc.gridOptions.data.splice(rc.gridOptions.data.lastIndexOf(data), 1);
                rc.resultsLength -= 1;
            });
        }

        rc.responseMessage = "";
        rc.symbol = true;

        rc.clearData = function() {
            // rc.gridOptions.data = [];
            // rc.resultsLength = 0;
            shareData.clearData();
        }

        var dataToContacts = [];

        rc.addSelected = function() {
            dataToContacts = [];
            angular.forEach(rc.gridApi.selection.getSelectedRows(), function(data, index) {
                dataToContacts.push(data);
                console.log('1.selected data is ' + dataToContacts);
                console.log('2.data is ' + data);

                // callback();
            });
        }

        rc.saveToContacts = function() {
            var myJsonString;
            console.log('3.selected data is ' + dataToContacts);

            // if none selected, save all
            if (dataToContacts.length === 0) {
                myJsonString = angular.toJson(rc.gridOptions.data);
                // myJsonString = JSON.stringify(rc.gridOptions.data);
            } else {
                myJsonString = angular.toJson(dataToContacts);
                //save the selected contacts
                // myJsonString = JSON.stringify(dataToContacts);
            }

            sendResults.sendLeads(myJsonString).then(function successCallback(res) {
                    rc.responseMessage = "Saved to Contacts!";
                }),
                function errorCallback(err) {
                    rc.responseMessage = "Error Occured";
                    rc.symbol = false;
                };
        }

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

        rc.addToContactsFeedback = function() {
            feedbackServices.successFeedback("Added to Contacts!", '#addToContactsFeedbackID');
        }

    }
]);