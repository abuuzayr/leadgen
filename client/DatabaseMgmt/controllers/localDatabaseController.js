app.controller('localDatabaseController', ['$scope', '$http', 'localData', 'uiGridConstants', '$q', '$location', '$timeout', 'sendDataToLocal', 'syncToCompany',
    function($scope, $http, localData, uiGridConstants, $q, $location, $timeout, sendDataToLocal, syncToCompany) {
        var ld = this;

        ld.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        };

        localData.success(function(data) {
            ld.gridOptions.data = data;
        });

        // for import function
        document.getElementById('get_file').onclick = function() {
            document.getElementById('files').click();
        };

        ld.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            showGridFooter: true,
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
            importerDataAddCallback: function(grid, newObjects) {
                ld.gridOptions.data = ld.gridOptions.data.concat(newObjects);
            }
        };

        ld.gridOptions.onRegisterApi = function(gridApi) {
            ld.gridApi = gridApi;

            //save after edit
            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
                $scope.$apply();
            });
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
            console.log('Found > 1 or < 1 file choosers within the menu item, error, cannot continue');
        } else {
            fileChooser[0].addEventListener('change', handleFileSelect, false); // TODO: why the false on the end?  Google  
        }

        // sync data to local database
        var appendData = sendDataToLocal.getData();

        ld.syncFromExternal = function() {
            for (var i = 0; i < appendData.length; i++) {
                ld.gridOptions.data.push(appendData[i]);
            }
        }

        // sync data to companies
        ld.responseMessage = "";
        ld.symbol = true;

        ld.syncToCompany = function() {
            var jsonFileToCompany = angular.toJson(ld.gridOptions.data);
            syncToCompany.sendToCompany(jsonFileToCompany).then(function successCallback(res) {
                    ld.responseMessage = "Synced to Companies!";
                }),
                function errorCallback(err) {
                    ld.responseMessage = "Error Occured";
                    ld.symbol = false;
                }
        }

        //delete selected leads
        ld.deleteSelected = function() {
            angular.forEach(ld.gridApi.selection.getSelectedRows(), function(data, index) {
                ld.gridOptions.data.splice(ld.gridOptions.data.lastIndexOf(data), 1);
            });
        }

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