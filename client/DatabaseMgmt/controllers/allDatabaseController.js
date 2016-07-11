app.controller('allDatabaseController', ['$scope', '$http', 'allData', 'uiGridConstants', '$q', '$location', '$timeout', 'uiGridExporterService', 'uiGridExporterConstants',
    function($scope, $http, allData, uiGridConstants, $q, $location, $timeout, uiGridExporterService, uiGridExporterConstants) {
        var allDB = this;

        allDB.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        };

        allData.success(function(data) {
            allDB.gridOptions.data = data;
        });

        allDB.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            showGridFooter: true,
            columnDefs: [{
                field: 'firstName',
                displayName: 'First Name',
                enableCellEdit: true,
                headerCellClass: allDB.highlightFilteredHeader
            }, {
                field: 'lastName',
                displayName: 'Last Name',
                headerCellClass: allDB.highlightFilteredHeader
            }, {
                field: 'company',
                displayName: 'Company',
                headerCellClass: allDB.highlightFilteredHeader
            }, {
                field: 'email',
                displayName: 'Email',
                headerCellClass: allDB.highlightFilteredHeader
            }, {
                field: 'phone',
                displayName: 'Phone',
                headerCellClass: allDB.highlightFilteredHeader
            }, {
                field: 'category',
                displayName: 'Category',
                headerCellClass: allDB.highlightFilteredHeader
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
                headerCellClass: allDB.highlightFilteredHeader,
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
            enableSelectAll: true,
            exporterCsvFilename: 'myLeads.csv',

            // onRegisterApi: function(gridApi){
            //   allDB.gridApi = gridApi;
            //   // gridApi.rowEdit.on.saveRow(allDB, allDB.saveRow);
            // }
        };

        allDB.gridOptions.onRegisterApi = function(gridApi) {
            allDB.gridApi = gridApi;

            //save after edit
            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
                $scope.$apply();
            });
        };

        //export function for all database
        allDB.export = function() {
            var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
            allDB.gridApi.exporter.csvExport(allDB.export_row_type, allDB.export_column_type, myElement);
        };

        //delete selected leads
        allDB.deleteSelected = function() {
            angular.forEach(allDB.gridApi.selection.getSelectedRows(), function(data, index) {
                allDB.gridOptions.data.splice(allDB.gridOptions.data.lastIndexOf(data), 1);
            });
        }

        //Open popup dialog box
        allDB.openDialog = function(dialogName) {
            var dialog = document.querySelector('#' + dialogName);
            if (!dialog.showModal) {
                dialogPolyfill.registerDialog(dialog);
            }
            dialog.showModal();
        };

        //Close popup dialog box
        allDB.closeDialog = function(dialogName) {
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