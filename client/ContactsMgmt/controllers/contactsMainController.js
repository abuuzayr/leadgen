app.controller('contactsMainController', ['$scope', '$window', 'leadsData', 'historyData', 'mailListData', 'contactsColumnData', '$http', '$interval', 'uiGridConstants', '$q', '$location', '$timeout', 'feedbackServices', function($scope, $window, leadsData, historyData, mailListData, contactsColumnData, $http, $interval, uiGridConstants, $q, $location, $timeout, feedbackServices) {

    leadsData.success(function(data) {
        $scope.gridOptions.data = data;
    });

    mailListData.success(function(data) {
        $scope.mailingList = data;
    });

    document.getElementById('get_file').onclick = function() {
        document.getElementById('files').click();
    };

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

    $scope.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
        if (col.filters[0].term) {
            return 'header-filtered';
        } else {
            return '';
        }
    };

    $scope.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        showGridFooter: true,
        columnDefs: [{
            field: 'firstName',
            displayName: 'First Name',
            minWidth: 80,
            width: 200,
            enableCellEdit: true,
            headerCellClass: $scope.highlightFilteredHeader
        }, {
            field: 'lastName',
            displayName: 'Last Name',
            minWidth: 80,
            width: 200,
            headerCellClass: $scope.highlightFilteredHeader
        }, {
            field: 'company',
            displayName: 'Company',
            minWidth: 80,
            width: 200,
            headerCellClass: $scope.highlightFilteredHeader
        }, {
            field: 'email',
            displayName: 'Email',
            enableCellEdit: false,
            minWidth: 80,
            width: 250,
            headerCellClass: $scope.highlightFilteredHeader
        }, {
            field: 'phone',
            displayName: 'Phone',
            enableCellEdit: false,
            minWidth: 80,
            width: 100,
            headerCellClass: $scope.highlightFilteredHeader
        }, {
            field: 'category',
            displayName: 'Category',
            minWidth: 80,
            width: 150,
            headerCellClass: $scope.highlightFilteredHeader
        }, {
            field: "type",
            displayName: "Type",
            editableCellTemplate: "ui-grid/dropdownEditor",
            minWidth: 80,
            width: 150,
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: "Corporate"
                }, {
                    value: "2",
                    label: "Consumer"
                }]
            },
            cellFilter: "mapType",
            editDropdownValueLabel: "type",
            headerCellClass: $scope.highlightFilteredHeader,
            editDropdownOptionsArray: [{
                id: 1,
                type: "Corporate"
            }, {
                id: 2,
                type: "Consumer"
            }]
        }, {
            field: "success",
            displayName: "Success",
            minWidth: 80,
            width: 120,
            headerCellClass: $scope.highlightFilteredHeader
        }, {
            field: "failure",
            displayName: "Failure",
            minWidth: 80,
            width: 120,
            headerCellClass: $scope.highlightFilteredHeader
        }, {
            field: "history",
            displayName: "History",
            minWidth: 80,
            width: 120,
            enableCellEdit: false,
            enableFiltering: false,
            enableSorting: false,
            enableEdit: false,
            cellTemplate: '<button class="btn primary" ng-click="grid.appScope.showMe(row.entity)">View</button> headerCellClass: $scope.highlightFilteredHeader'
        }],
        importerDataAddCallback: function(grid, newObjects) {
            $scope.gridOptions.data = $scope.gridOptions.data.concat(newObjects);
            var importStatus = $http.post("http://localhost:8080/api/contacts/leadList/import", newObjects);
            $window.location.reload();
        },
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            //save after edit
            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
                $scope.$apply();
                var obj = {};
                obj[colDef.name] = newValue;
                var editData = [rowEntity, obj];
                var editStatus = $http.patch("http://localhost:8080/api/contacts/leadList/leads", editData);
                $window.location.reload();
            });
        }
    };

    //refresh
    $scope.refresh = function() {
        $window.location.reload();
    };

    //Get columndefs
    contactsColumnData.success(function(data) {
        console.log(data);
        for (var x of data) {
            $scope.gridOptions.columnDefs.push(x);
        }
    });

    //show history dialog
    $scope.showMe = function(value) {
        historyData.getHistory(value._id).then(function successCallback(res) {
                $scope.history = res.data;
            }),
            function errorCallback(err) {
                console.log('err is ' + err);
            };
        var dialog = document.getElementById('historyData');
        dialog.showModal();
    };

    //add new lead
    $scope.addData = function() {
        var n = $scope.gridOptions.data.length + 1;
        $scope.gridOptions.data.push({
            "firstName": $scope.lead.first,
            "lastName": $scope.lead.last,
            "company": $scope.lead.company,
            "email": $scope.lead.email,
            "phone": $scope.lead.phone,
            "category": $scope.lead.category,
            "type": $scope.lead.type,
            "success": 0,
            "failure": 0,
            "history": '',
        });
        var lead = {
            "firstName": $scope.lead.first,
            "lastName": $scope.lead.last,
            "company": $scope.lead.company,
            "email": $scope.lead.email,
            "phone": $scope.lead.phone,
            "category": $scope.lead.category,
            "type": $scope.lead.type,
            "success": 0,
            "failure": 0,
            "history": '',
        };
        var addStatus = $http.post("http://localhost:8080/api/contacts/leadList/leads", lead);
    };

    //delete selected leads
    $scope.deleteSelected = function() {
        angular.forEach($scope.gridApi.selection.getSelectedRows(), function(data, index) {
            $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
        });
        var leads = $scope.gridApi.selection.getSelectedRows();
        var deleteStatus = $http.put("http://localhost:8080/api/contacts/leadList/leads", leads);
        $window.location.reload();
    };

    // add field
    $scope.addField = function() {
        var fieldName = $scope.field.name;
        var arrName = fieldName.split(" ");
        var editedField = "";
        var editedDisplay = "";
        for (var x of arrName) {
            if (y !== "") {
                editedField += x;
            }
        }
        for (var y of arrName) {
            if (y !== "") {
                editedDisplay += y;
                editedDisplay += " ";
            }
        }
        var display = editedDisplay.slice(0, editedDisplay.length - 1);
        var lowerName = editedField.toLowerCase();
        $scope.gridOptions.columnDefs.push({
            field: lowerName,
            displayName: display
        });
        var field = {
            field: lowerName,
            displayName: display
        };
        var addStatus = $http.post("http://localhost:8080/api/contacts/leadList/fields", field);
        $window.location.reload();
    };

    $scope.selectDeleteField = function() {
        $scope.selectedDeleteField = $scope.fieldSelected;
    };

    // delete field
    $scope.deleteField = function() {
        for (var x in $scope.gridOptions.columnDefs) {
            if (($scope.gridOptions.columnDefs[x].displayName === $scope.selectedDeleteField)) {
                var fieldName = $scope.gridOptions.columnDefs[x].field;
                $scope.gridOptions.columnDefs.splice(x, 1);
                var fieldObj = {
                    field: fieldName
                };
                var deleteStatus = $http.put("http://localhost:8080/api/contacts/leadList/fields", fieldObj);
                $window.location.reload();
            }
        }
    };

    // add leads to mailing list
    $scope.addToMailingList = function() {
        var id = "";
        for (var x of $scope.mailingList) {
            if (x.name === $scope.listSelected) {
                id = x.listID;
            }
        }
        var y = $scope.gridApi.selection.getSelectedRows();
        var obj = [{
            y
        }, {
            listID: id,
            name: $scope.listSelected
        }];
        console.log(obj);
        var addStatus = $http.post("http://localhost:8080/api/contacts/mailingList/subscriber", obj);
        $window.location.reload();
    };

    $scope.removeDuplicateField = function() {
        $scope.selectedDuplicateField = $scope.fieldSelected;
    };

    //Remove duplicates
    $scope.removeDuplicate = function() {
        console.log($scope.selectedDuplicateField);
        var field = "";
        for (var x of $scope.gridOptions.columnDefs) {
            if (x.displayName === $scope.selectedDuplicateField) {
                field = x.field;
            }
        }
        var fieldObj = {
            fieldName: field
        };
        var removeStatus = $http.put("http://localhost:8080/api/contacts/leadList/leads/duplicates", fieldObj);
        $window.location.reload();
    };

    //import function
    var handleFileSelect = function(event) {
        var target = event.srcElement || event.target;

        if (target && target.files && target.files.length === 1) {
            var fileObject = target.files[0];
            console.log("abc");
            $scope.gridApi.importer.importFile(fileObject);
            target.form.reset();
        }
    };

    var fileChooser = document.querySelectorAll('.file-chooser');
    if (fileChooser.length !== 1) {
        console.log('Found > 1 or < 1 file choosers within the menu item, error, cannot continue');
    } else {
        fileChooser[0].addEventListener('change', handleFileSelect, false); // TODO: why the false on the end?  Google  
        console.log("def");
    }

    //Open popup dialog box
    $scope.openDialog = function(dialogName) {
        var dialog = document.querySelector('#' + dialogName);
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        dialog.showModal();
    };

    //Close popup dialog box
    $scope.closeDialog = function(dialogName) {
        var dialog = document.querySelector('#' + dialogName);
        $scope.addResult = "";
        dialog.close();
    };

    $scope.addFeedback = function() {
        feedbackServices.successFeedback("Added!", '#addFeedbackID');
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
            return 'Unselected';
        } else {
            return typeHash[input];
        }
    };
});