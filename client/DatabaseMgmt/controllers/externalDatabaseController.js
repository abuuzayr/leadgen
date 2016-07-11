app.controller('externalDatabaseController', ['$scope', '$http', 'externalData', 'uiGridConstants', '$q', '$location', '$timeout', 'sendDataToLocal', function($scope, $http, externalData, uiGridConstants, $q, $location, $timeout, sendDataToLocal) {
    var ed = this;

    ed.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
        if (col.filters[0].term) {
            return 'header-filtered';
        } else {
            return '';
        }
    };

    externalData.success(function(data) {
        ed.gridOptions.data = data;
        // console.log('data from external is ' + ed.gridOptions.data);
        sendDataToLocal.setData(ed.gridOptions.data);
    });

    ed.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        showGridFooter: true,
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
        }, ],
        // onRegisterApi: function(gridApi){ 
        //   ed.gridApi = gridApi;
        //   // gridApi.rowEdit.on.saveRow(ed, ed.saveRow);
        // }
    };

    ed.gridOptions.onRegisterApi = function(gridApi) {
        ed.gridApi = gridApi;

        //save after edit
        gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
            console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
            $scope.$apply();
        });
    };

    //delete selected leads
    ed.deleteSelected = function() {
        angular.forEach(ed.gridApi.selection.getSelectedRows(), function(data, index) {
            ed.gridOptions.data.splice(ed.gridOptions.data.lastIndexOf(data), 1);
        });
    }

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

}])

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