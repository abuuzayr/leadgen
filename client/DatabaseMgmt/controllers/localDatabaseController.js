(function() {
    'use strict';
    app.controller('localDatabaseController', ['$scope', '$http', 'localData', 'uiGridConstants', '$q', '$location', '$timeout', 'sendDataToLocal', '$window',
        function($scope, $http, localData, uiGridConstants, $q, $location, $timeout, sendDataToLocal, $window) {
            var ld = this;

            ld.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
                if (col.filters[0].term) {
                    return 'header-filtered';
                } else {
                    return '';
                }
            };

            /** For importing leads */
            document.getElementById('get_file').onclick = function() {
                document.getElementById('files').click();
            };

            /** Get import type (corporate or consumer) and for ng-disabled */
            ld.importType;
            ld.continue = true;
            ld.continueToImport = function() {
                if (angular.isDefined(ld.importType)) {
                    ld.continue = false;
                }
            };

            ld.gridOptions = {
                enableSorting: true,
                enableFiltering: true,
                showGridFooter: true,
                data: [],
                columnDefs: [{
                    field: 'firstName',
                    displayName: 'First Name',
                    enableCellEdit: true,
                    headerCellClass: ld.highlightFilteredHeader
                }, {
                    field: 'lastName',
                    displayName: 'Last Name',
                    headerCellClass: ld.highlightFilteredHeader
                }, {
                    field: 'company',
                    displayName: 'Company',
                    headerCellClass: ld.highlightFilteredHeader
                }, {
                    field: 'email',
                    displayName: 'Email',
                    headerCellClass: ld.highlightFilteredHeader
                }, {
                    field: 'phone',
                    displayName: 'Phone',
                    headerCellClass: ld.highlightFilteredHeader
                }, {
                    field: 'category',
                    displayName: 'Category',
                    headerCellClass: ld.highlightFilteredHeader
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
                    headerCellClass: ld.highlightFilteredHeader,
                    editDropdownValueLabel: 'type',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownOptionsArray: [{
                        id: 1,
                        type: 'Corporate'
                    }, {
                        id: 2,
                        type: 'Consumer'
                    }]
                }, ],

                /** 
                 * Appends the imported data to UI Grid
                 * importToLocal - updates database
                 * @param {Object} - importObjectToSend
                 */
                importerDataAddCallback: function(grid, newObjects) {
                    ld.gridOptions.data = ld.gridOptions.data.concat(newObjects);

                    var importObjectToSend = {
                        type: ld.importType,
                        data: newObjects
                    };

                    localData.importToLocal(importObjectToSend).then(function successCallback(res) {
                            ld.importResponse = 'Imported Successfully';
                        }),
                        function errorCallback(err) {
                            ld.importResponse = "Error Occured";
                        };
                }
            };

            /** Gets leads from database and binds to UI-Grid */
            localData.getLocalLeads().then(function successCallback(res) {
                    ld.gridOptions.data = res.data;
                }),
                function errorCallback(err) {

                };

            var colName = '';
            var editedValue = '';
            var row = {};

            ld.gridOptions.onRegisterApi = function(gridApi) {
                ld.gridApi = gridApi;

                /** Opens a dialog after the user edits a cell */
                gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                    ld.openDialog('editUser');
                    $scope.$apply();
                    colName = colDef.name;
                    editedValue = newValue;
                    row = rowEntity;
                });
            };

            /** Confirms the edit, updates the database and refreshes the page */
            ld.editUser = function(gridApi) {
                ld.gridApi = gridApi;
                if (angular.isDefined(colName) && angular.isDefined(editedValue) && angular.isDefined(row)) {
                    var obj = {};
                    obj[colName] = editedValue;
                    var editData = [row, obj];
                    localData.editLocalLeads(editData)
                        .then(function(res) {
                            ld.closeDialog('editUser');
                            $window.location.reload();
                        });
                }
            };

            /** Cancels the edit and refresh the page */
            ld.cancelEdit = function() {
                ld.closeDialog('editUser');
                $window.location.reload();
            };

            var handleFileSelect = function(event) {
                var target = event.srcElement || event.target;

                if (target && target.files && target.files.length === 1) {
                    var fileObject = target.files[0];
                    ld.gridApi.importer.importFile(fileObject);
                    target.form.reset();
                }
            };

            var fileChooser = document.querySelectorAll('.file-chooser');

            if (fileChooser.length !== 1) {
                fileChooser[0].addEventListener('change', handleFileSelect, false);
            }

            /** 
             * Syncs leads from external database to local database 
             * syncFromExternalLeads -  updates database
             */
            var appendData = sendDataToLocal.getData();

            ld.syncFromExternal = function() {
                for (var i = 0; i < appendData.length; i++) {
                    ld.gridOptions.data.push(appendData[i]);
                }

                localData.syncFromExternalLeads();
            };

            /**
             * Deletes the selected leads
             * deleteLocalLeads - delete leads from database
             * @param {array} selectedLeadsToDelete - The leads to be deleted
             */
            ld.deleteSelected = function() {
                angular.forEach(ld.gridApi.selection.getSelectedRows(), function(data, index) {
                    ld.gridOptions.data.splice(ld.gridOptions.data.lastIndexOf(data), 1);
                });

                var selectedLeadsToDelete = ld.gridApi.selection.getSelectedRows();
                localData.deleteLocalLeads(selectedLeadsToDelete);
            };

            //Open popup dialog box
            ld.openDialog = function(dialogName) {
                var dialog = document.querySelector('#' + dialogName);
                if (!dialog.showModal) {
                    dialogPolyfill.registerDialog(dialog);
                }
                dialog.showModal();
            };

            //Close popup dialog box
            ld.closeDialog = function(dialogName) {
                var dialog = document.querySelector('#' + dialogName);
                dialog.close();
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