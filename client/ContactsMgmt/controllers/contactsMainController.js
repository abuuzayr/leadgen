app.controller('contactsMainController', ['$scope', '$window', 'appConfig', 'leadsData', 'historyData', 'mailListData', 'contactsColumnData', '$http', '$interval', 'uiGridConstants', '$q', '$location', '$timeout', 'feedbackServices', function($scope, $window, appConfig, leadsData, historyData, mailListData, contactsColumnData, $http, $interval, uiGridConstants, $q, $location, $timeout, feedbackServices) {
    
    var cc = this;

    leadsData.success(function(data) {
        cc.gridOptions.data = data;
    });

    mailListData.success(function(data) {
        cc.mailingList = data;
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

    cc.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
        if (col.filters[0].term) {
            return 'header-filtered';
        } else {
            return '';
        }
    };

    cc.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        showGridFooter: true,
        columnDefs: [{
            field: 'firstName',
            displayName: 'First Name',
            minWidth: 80,
            width: 200,
            enableCellEdit: true,
            headerCellClass: cc.highlightFilteredHeader
        }, {
            field: 'lastName',
            displayName: 'Last Name',
            minWidth: 80,
            width: 200,
            headerCellClass: cc.highlightFilteredHeader
        }, {
            field: 'company',
            displayName: 'Company',
            minWidth: 80,
            width: 200,
            headerCellClass: cc.highlightFilteredHeader
        }, {
            field: 'email',
            displayName: 'Email',
            enableCellEdit: false,
            minWidth: 80,
            width: 250,
            headerCellClass: cc.highlightFilteredHeader
        }, {
            field: 'phone',
            displayName: 'Phone',
            enableCellEdit: false,
            minWidth: 80,
            width: 100,
            headerCellClass: cc.highlightFilteredHeader
        }, {
            field: 'category',
            displayName: 'Category',
            minWidth: 80,
            width: 150,
            headerCellClass: cc.highlightFilteredHeader
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
            headerCellClass: cc.highlightFilteredHeader,
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
            headerCellClass: cc.highlightFilteredHeader
        }, {
            field: "failure",
            displayName: "Failure",
            minWidth: 80,
            width: 120,
            headerCellClass: cc.highlightFilteredHeader
        }, {
            field: "history",
            displayName: "History",
            minWidth: 80,
            width: 120,
            enableCellEdit: false,
            enableFiltering: false,
            enableSorting: false,
            enableEdit: false,
            headerCellClass: cc.highlightFilteredHeader,
            cellTemplate: '<button class="btn primary" ng-click="grid.appScope.cc.showMe(row.entity)">View</button>'
        }],
        importerDataAddCallback: function(grid, newObjects) {
            cc.gridOptions.data = cc.gridOptions.data.concat(newObjects);
            var url = "/contacts/leadList/import";
            var importStatus = $http.post("API_URL" + url, newObjects);
            cc.addFeedback();
        },
        onRegisterApi: function(gridApi) {
            cc.gridApi = gridApi;
            //save after edit
            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
                $scope.$apply();
                var obj = {};
                obj[colDef.name] = newValue;
                var editData = [rowEntity, obj];
                var url = "/contacts/leadList/leads";
                var editStatus = $http.patch("API_URL" + url, editData);
                $window.location.reload();
            });
        }
    };

    //refresh
    cc.refresh = function() {
        $window.location.reload();
    };

    //Get columndefs
    contactsColumnData.success(function(data) {
        console.log(data);
        for (var x of data) {
            cc.gridOptions.columnDefs.push(x);
        }
    });

    //show history dialog
    cc.showMe = function(value) {
        historyData.getHistory(value._id).then(function successCallback(res) {
                cc.history = res.data;
                if (cc.history.length === 0) {
                    cc.history = [{
                        "action": "----------",
                        "timestamp": "----------------------------------"
                    }];
                }
            }),
            function errorCallback(err) {
                console.log('err is ' + err);
            };
        var dialog = document.getElementById('historyData');
        dialog.showModal();
    };

    //add new lead
    cc.addData = function() {
        var n = cc.gridOptions.data.length + 1;
        cc.gridOptions.data.push({
            "firstName": cc.lead.first,
            "lastName": cc.lead.last,
            "company": cc.lead.company,
            "email": cc.lead.email,
            "phone": cc.lead.phone,
            "category": cc.lead.category,
            "type": cc.lead.type,
            "success": 0,
            "failure": 0,
            "history": '',
        });
        var lead = {
            "firstName": cc.lead.first,
            "lastName": cc.lead.last,
            "company": cc.lead.company,
            "email": cc.lead.email,
            "phone": cc.lead.phone,
            "category": cc.lead.category,
            "type": cc.lead.type,
            "success": 0,
            "failure": 0,
            "history": '',
        };
        var url = "/contacts/leadList/leads";
        var addStatus = $http.post("API_URL" + url, lead);
    };

    //delete selected leads
    cc.deleteSelected = function() {
        angular.forEach(cc.gridApi.selection.getSelectedRows(), function(data, index) {
            cc.gridOptions.data.splice(cc.gridOptions.data.lastIndexOf(data), 1);
        });
        var leads = cc.gridApi.selection.getSelectedRows();
        var url = "/contacts/leadList/leads";
        var deleteStatus = $http.put("API_URL" + url, leads);
        console.log(deleteStatus);
        $window.location.reload();
    };

    // add field
   cc.addField = function() {
        var fieldName = cc.field.name;
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
        cc.gridOptions.columnDefs.push({
            field: lowerName,
            displayName: display
        });
        var field = {
            field: lowerName,
            displayName: display
        };
        var url = "/contacts/leadList/fields";
        var addStatus = $http.post("API_URL" + url, field);
        $window.location.reload();
    };

    cc.selectDeleteField = function() {
        cc.selectedDeleteField = cc.fieldSelected;
    };

    // delete field
    cc.deleteField = function() {
        for (var x in cc.gridOptions.columnDefs) {
            if ((cc.gridOptions.columnDefs[x].displayName === cc.selectedDeleteField)) {
                var fieldName = cc.gridOptions.columnDefs[x].field;
                cc.gridOptions.columnDefs.splice(x, 1);
                var fieldObj = {
                    field: fieldName
                };
                var url = "/contacts/leadList/fields";
                var deleteStatus = $http.put("API_URL" + url, fieldObj);
                $window.location.reload();
            }
        }
    };

    // add leads to mailing list
    cc.addToMailingList = function() {
        var id = "";
        for (var x of cc.mailingList) {
            if (x.name === cc.listSelected) {
                id = x.listID;
            }
        }
        var y = cc.gridApi.selection.getSelectedRows();
        var obj = [{
            y
        }, {
            listID: id,
            name: cc.listSelected
        }];
        console.log(obj);
        var url = "/contacts/mailingList/subscriber";
        var addStatus = $http.post("API_URL" + url, obj);
    };

    cc.removeDuplicateField = function() {
        cc.selectedDuplicateField = cc.fieldSelected;
    };

    //Remove duplicates
    cc.removeDuplicate = function() {
        console.log(cc.selectedDuplicateField);
        var field = "";
        for (var x of cc.gridOptions.columnDefs) {
            if (x.displayName === cc.selectedDuplicateField) {
                field = x.field;
            }
        }
        var fieldObj = {
            fieldName: field
        };
        var url = "/contacts/leadList/leads/duplicates";
        var removeStatus = $http.put("API_URL" + url, fieldObj);
        $window.location.reload();
    };

    //import function
    var handleFileSelect = function(event) {
        var target = event.srcElement || event.target;

        if (target && target.files && target.files.length === 1) {
            var fileObject = target.files[0];
            console.log("abc");
            cc.gridApi.importer.importFile(fileObject);
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
    cc.openDialog = function(dialogName) {
        var dialog = document.querySelector('#' + dialogName);
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        dialog.showModal();
    };

    //Close popup dialog box
    cc.closeDialog = function(dialogName) {
        var dialog = document.querySelector('#' + dialogName);
       cc.addResult = "";
        dialog.close();
    };

    cc.addFeedback = function() {
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