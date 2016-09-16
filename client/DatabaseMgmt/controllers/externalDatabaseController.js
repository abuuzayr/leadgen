(function() {
    'use strict';
    app.controller('externalDatabaseController', ['$scope', '$window', '$http', 'externalData', 'uiGridConstants', '$q', '$location', '$timeout', 'sendDataToLocal',
        function($scope, $window, $http, externalData, uiGridConstants, $q, $location, $timeout, sendDataToLocal) {
            var ed = this;

            ed.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
                if (col.filters[0].term) {
                    return 'header-filtered';
                } else {
                    return '';
                }
            };

            ed.gridOptions = {
                enableSorting: true,
                enableFiltering: true,
                showGridFooter: true,
                data: [],
                columnDefs: [{
                    field: 'firstName',
                    displayName: 'First Name',
                    enableCellEdit: true,
                    headerCellClass: ed.highlightFilteredHeader
                }, {
                    field: 'lastName',
                    displayName: 'Last Name',
                    headerCellClass: ed.highlightFilteredHeader
                }, {
                    field: 'company',
                    displayName: 'Company',
                    headerCellClass: ed.highlightFilteredHeader
                }, {
                    field: 'email',
                    displayName: 'Email',
                    headerCellClass: ed.highlightFilteredHeader
                }, {
                    field: 'phone',
                    displayName: 'Phone',
                    headerCellClass: ed.highlightFilteredHeader
                }, {
                    field: 'category',
                    displayName: 'Category',
                    headerCellClass: ed.highlightFilteredHeader
                }, {
                    field: 'type',
                    displayName: 'Type',
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: [{
                            value: '1',
                            label: 'Corporate'
                        }, {
                            value: '2',
                            label: 'Consumer'
                        }]
                    },
                    cellFilter: 'mapType',
                    headerCellClass: ed.highlightFilteredHeader,
                    editDropdownValueLabel: 'type',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownOptionsArray: [{
                        id: 1,
                        type: 'Corporate'
                    }, {
                        id: 2,
                        type: 'Consumer'
                    }]
                }, {
                    field: 'source',
                    displayName: 'Source',
                    headerCellClass: ed.highlightFilteredHeader
                }],
            };

            /** 
             * Gets leads from database and bind to UI-Gird 
             * setData is used for the function to send leads from external database to local database
             */
            externalData.getExternalLeads().then(function successCallback(res) {
                    ed.gridOptions.data = res.data;

                    sendDataToLocal.setData(ed.gridOptions.data);
                }),
                function errorCallback(err) {

                };

            var colName = '';
            var editedValue = '';
            var row = {};

            ed.gridOptions.onRegisterApi = function(gridApi) {
                ed.gridApi = gridApi;

                /** Opens a dialog after the user edits a cell */
                gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                    ed.openDialog('editUser');
                    $scope.$apply();
                    colName = colDef.name;
                    editedValue = newValue;
                    row = rowEntity;
                });
            };

            /** Confirms the edit, updates the database and refreshes the page */
            ed.editUser = function(gridApi) {
                ed.gridApi = gridApi;

                if (angular.isDefined(colName) && angular.isDefined(editedValue) && angular.isDefined(row)) {
                    var obj = {};
                    obj[colName] = editedValue;
                    var editData = [row, obj];
                    externalData.editExternalLeads(editData)
                        .then(function(res) {
                            ed.closeDialog('editUser');
                            $window.location.reload();
                        });
                }
            };

            /** Cancels the edit and refresh the page */
            ed.cancelEdit = function() {
                ed.closeDialog('editUser');
                $window.location.reload();
            };

            /**
             * Deletes the selected leads
             * deleteExternalLeads - delete leads from database
             * @param {array} selectedLeadsToDelete - The leads to be deleted
             */
            ed.deleteSelected = function() {
                angular.forEach(ed.gridApi.selection.getSelectedRows(), function(data, index) {
                    ed.gridOptions.data.splice(ed.gridOptions.data.lastIndexOf(data), 1);
                });

                var selectedLeadsToDelete = ed.gridApi.selection.getSelectedRows();
                externalData.deleteExternalLeads(selectedLeadsToDelete)
                    .then(function(res) {
                        ed.closeDialog('deleteLead');
                    });
            };

            /** Updates the leads for external database */
            ed.updateExternal = function() {

                externalData.updateExternalLeads();
            };

            //Open popup dialog box
            ed.openDialog = function(dialogName) {
                var dialog = document.querySelector('#' + dialogName);
                if (!dialog.showModal) {
                    dialogPolyfill.registerDialog(dialog);
                }
                dialog.showModal();
            };

            //Close popup dialog box
            ed.closeDialog = function(dialogName) {
                var dialog = document.querySelector('#' + dialogName);
                dialog.close();
            };

            ed.refresh = function() {
                $window.location.reload();
            };

        }
    ])

    //filter drop down option hashing
    .filter('mapType', function() {
        var typeHash = {
            1: 'Corporate',
            2: 'Consumer'
        };

        return function(input) {
            if (!input) {
                return 'error';
            } else {
                return typeHash[input];
            }
        };
    });
})();