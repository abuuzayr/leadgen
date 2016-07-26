app.controller('contactsMainController', ['$scope', '$window', 'appConfig', 'leadsData', 'historyData', 'mailListData', 'contactsColumnData', '$http', '$interval', 'uiGridConstants', '$q', '$location', '$timeout', 'feedbackServices', function($scope, $window, appConfig, leadsData, historyData, mailListData, contactsColumnData, $http, $interval, uiGridConstants, $q, $location, $timeout, feedbackServices) {

    var cc = this;

    /** This is used to get leads from database */
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

        /** 
         * This method takes in a file object and a grid as it’s parameters. 
         * The method adds the data within the file into the grid and stores the data into the database. 
         */
        importerDataAddCallback: function(grid, newObjects) {
            cc.gridOptions.data = cc.gridOptions.data.concat(newObjects);
            var url = "/contacts/leadList/import";
            var importStatus = $http.post(appConfig.API_URL + url, newObjects);
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
                $http.patch(appConfig.API_URL + url, editData)
                .success(function(res){
                    $window.location.reload();
                });
                
            });
        }
    };

    /** 
     * This method refreshes the page. 
     * It is used to update the data shown in UI-Grid
     */
    cc.refresh = function() {
        $window.location.reload();
    };


    //Get columndefs
    cc.fields = [];
    contactsColumnData.success(function(data) {
        for (var x of data) {
            cc.gridOptions.columnDefs.push(x);
            cc.fields.push(x);
        }
    });


    /** 
     * This method takes in a parameter which is a selected row entity. 
     * It retrieves the history data of the row entity and displays the data in a dialog.
     * @param {} value - The selected row entity
     */
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

    /** 
     * This method adds a new lead into the database based 
     * on the data retrieve using ng-model.
     * This method also updates the database with the new lead
     * @param {} lead - The lead to be added
     */
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
        var addStatus = $http.post(appConfig.API_URL + url, lead);
    };

    /** 
     * This method retrieves and removes the selected rows from UI-Grid table
     *  and deletes the data from the database. The page will be reloaded when 
     *  deleting the lead from the database is successful to update the UI-Grid
     *  @param {array} leads - The selected rows to delete 
     */
    cc.deleteSelected = function() {
        angular.forEach(cc.gridApi.selection.getSelectedRows(), function(data, index) {
            cc.gridOptions.data.splice(cc.gridOptions.data.lastIndexOf(data), 1);
        });
        var leads = cc.gridApi.selection.getSelectedRows();
        var url = "/contacts/leadList/leads";
        $http.put(appConfig.API_URL + url, leads)
            .then(function(res) {
                $window.location.reload();
            })
            .catch(function(err) {
                console.log(err);
            });
    };

    /** 
     * This method adds a new field into the UI-Grid table 
     * and stores the new field into the database based on data retrieve using ng-model.
     * @param {} field - The new field to be added 
     */
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
            displayName: display,
            minWidth: 80,
            width: 200
        });
        cc.fields.push({
            field: lowerName,
            displayName: display,
            minWidth: 80,
            width: 200
        });
        var field = {
            field: lowerName,
            displayName: display,
            minWidth: 80,
            width: 200
        };
        var url = "/contacts/leadList/fields";
        var addStatus = $http.post(appConfig.API_URL + url, field);
       // $window.location.reload();
    };

    /** 
     * This method creates a new variable to store the data of the field to be deleted. 
     * It is retrieve using ng-model. 
     * This method is called so as to 
     * facilitate the confirmation of delete via popup dialog.
     */
    cc.selectDeleteField = function() {
        cc.selectedDeleteField = cc.fieldSelected;
    };

    /** 
     * This method deletes a field based on the data binded to the variable created 
     *  when selectDeleteField() method is called.
     *  The selected field will also be deleted from the database and the page
     *  will be reloaded to update the UI Grid table.
     *  @param {} fieldObj - The selected field to be deleted
     */
    cc.deleteField = function() {
        for (var x in cc.gridOptions.columnDefs) {
            if ((cc.gridOptions.columnDefs[x].displayName === cc.selectedDeleteField)) {
                var fieldName = cc.gridOptions.columnDefs[x].field;
                cc.gridOptions.columnDefs.splice(x, 1);
                var fieldObj = {
                    field: fieldName
                };
                var url = "/contacts/leadList/fields";
                var deleteStatus = $http.put(appConfig.API_URL + url, fieldObj);
                $window.location.reload();
            }
        }
        for (var x in cc.fields) {
            if ((cc.fields[x].displayName === cc.selectedDeleteField)) {
                var fieldName = cc.fields[x].field;
                cc.fields.splice(x, 1);
            }
        }
    };

    /**
     * This method retrieves leads based on selected rows and 
     * add them to a mailing list based on the specific mailing list retrieve from ng-model.
     * It also updates the database 
     * @param {} obj - The name of the mailing list and leads to be added
     */
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
        var url = "/contacts/mailingList/subscriber";
        var addStatus = $http.post(appConfig.API_URL + url, obj);
    };

    cc.removeDuplicateField = function() {
        cc.selectedDuplicateField = cc.fieldSelected;
    };

    /**
     * This method removes duplicated leads based on the specific field selected. 
     * Data of specific field selected is retrieve using ng-model.
     * It also updates the database.
     */
    cc.removeDuplicate = function() {
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
        var removeStatus = $http.put(appConfig.API_URL + url, fieldObj);
        $window.location.reload();
    };

    /**
     * This method is called when an import event occurs. 
     * It retrieves the file object from the event and pass on to the import function.
     * @param {} event 
     */
    var handleFileSelect = function(event) {
        var target = event.srcElement || event.target;

        if (target && target.files && target.files.length === 1) {
            var fileObject = target.files[0];
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

    /** This method is called to initialize and display a success message via a snackbar upon successfully adding new data. */
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
