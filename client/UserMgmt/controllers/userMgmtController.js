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

        allUsersData.success(function(data) {
            uc.gridOptions.data = data;
            console.log(data);
        });

        uc.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            showGridFooter: true,
            minRowsToShow: 10,
            columnDefs: [{
                field: 'firstName',
                displayName: 'First Name',
                minWidth: 80,
                width: 150,
                enableCellEdit: true,
                headerCellClass: uc.highlightFilteredHeader
            }, {
                field: 'lastName',
                displayName: 'Last Name',
                minWidth: 80,
                width: 150,
                headerCellClass: uc.highlightFilteredHeader
            }, {
                field: 'role',
                displayName: 'Role',
                minWidth: 80,
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
                minWidth: 80,
                width: 200,
                headerCellClass: uc.highlightFilteredHeader
            }, {
                field: 'phone',
                displayName: 'Phone',
                minWidth: 80,
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

        //delete selected users
        uc.deleteSelected = function() {
            angular.forEach(uc.gridApi.selection.getSelectedRows(), function(data, index) {
                uc.gridOptions.data.splice(uc.gridOptions.data.lastIndexOf(data), 1);
            });
        };

        uc.gridOptions.onRegisterApi = function(gridApi) {
            uc.gridApi = gridApi;

            //save after edit
            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
                $scope.$apply();
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

        uc.addFeedback = function() {
            feedbackServices.successFeedback("Added!", '#addUserFeedbackID');
        }

        uc.deleteFeedback = function() {
            feedbackServices.successFeedback("Deleted!", '#addUserFeedbackID');
        }

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