app.controller('userMgmtController', ['$scope', '$http', 'allUsersData', 'uiGridConstants', '$q', '$location', '$timeout', 'feedbackServices', '$window',
    function($scope, $http, allUsersData, uiGridConstants, $q, $location, $timeout, feedbackServices, $window) {
        var uc = this;

        uc.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        };

        uc.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            showGridFooter: true,
            minRowsToShow: 10,
            columnDefs: [{
                field: 'firstName',
                displayName: 'First Name',
                minWidth: 100,
                width: 150,
                enableCellEdit: true,
                headerCellClass: uc.highlightFilteredHeader
            }, {
                field: 'lastName',
                displayName: 'Last Name',
                minWidth: 100,
                width: 150,
                headerCellClass: uc.highlightFilteredHeader
            }, {
                field: 'role',
                displayName: 'Role',
                minWidth: 100,
                width: 120,
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [{
                        value: '1',
                        label: 'Admin'
                    }, {
                        value: '2',
                        label: 'User'
                    }]
                },
                cellFilter: 'mapRole',
                headerCellClass: uc.highlightFilteredHeader,
                editDropdownValueLabel: 'role',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownOptionsArray: [{
                    id: 1,
                    role: 'Admin'
                }, {
                    id: 2,
                    role: 'User'
                }]
            }, {
                field: 'email',
                displayName: 'Email',
                minWidth: 200,
                headerCellClass: uc.highlightFilteredHeader
            }, {
                field: 'phone',
                displayName: 'Phone',
                minWidth: 100,
                width: 150,
                headerCellClass: uc.highlightFilteredHeader
            }, ],
        };


        //add new user
        uc.addData = function() {
            var n = uc.gridOptions.data.length + 1;
            uc.gridOptions.data.push({
                "firstName": uc.lead.first,
                "lastName": uc.lead.last,
                "role": uc.lead.role,
                "email": uc.lead.email,
                "phone": uc.lead.phone,
            });
            uc.addResult = "Success!";
        };

        // get data from server
        allUsersData.getUserData().then(function successCallback(res) {
                uc.gridOptions.data = res.data;
            }),
            function errorCallback(err) {}

        //delete selected leads
        uc.deleteSelected = function() {
            angular.forEach(uc.gridApi.selection.getSelectedRows(), function(data, index) {
                uc.gridOptions.data.splice(uc.gridOptions.data.lastIndexOf(data), 1);
            });

            var selectedUsersToDelete = uc.gridApi.selection.getSelectedRows();
            console.log(selectedUsersToDelete);
            allUsersData.deleteUserData(selectedUsersToDelete).then(function successCallback(res) {
                return feedbackServices.hideFeedback('#userManagementFeedback').
                then(feedbackServices.successFeedback('Deleted!', '#userManagementFeedback', 2000));
            }).catch(function errorCallback(err) {
                return feedbackServices.hideFeedback('#userManagementFeedback').
                then(feedbackServices.successFeedback(err.data, '#userManagementFeedback', 2000));
            })
        }

        uc.gridOptions.onRegisterApi = function(gridApi) {
            uc.gridApi = gridApi;

            //save after edit
            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
                $scope.$apply();

                var obj = {};
                obj[colDef.name] = newValue;
                var editData = [rowEntity, obj];
                allUsersData.editUserData(editData);
                // $window.location.reload();
            });
        };

        //popup dialog box
        uc.openDialog = function(dialogName) {
            var dialog = document.querySelector('#' + dialogName);
            if (!dialog.showModal) {
                dialogPolyfill.registerDialog(dialog);
            }
            dialog.showModal();
        };
        uc.closeDialog = function(dialogName) {
            var dialog = document.querySelector('#' + dialogName);
            dialog.close();
        };

        //refresh
        uc.refresh = function() {
            $window.location.reload();
        };

    }
])


//filter drop down option hashing
.filter('mapRole', function() {
    var roleHash = {
        1: 'Admin',
        2: 'User'
    };

    return function(input) {
        if (!input) {
            console.log('input is ' + input);
            return 'error';
        } else {
            return roleHash[input];
        }
    };
});