app.controller('userMgmtController', ['$scope', '$http', 'allUsersData', 'uiGridConstants', '$q', '$location', '$timeout', 'feedbackServices', '$window', 'authServices',
    function($scope, $http, allUsersData, uiGridConstants, $q, $location, $timeout, feedbackServices, $window, authServices) {
        var uc = this;
        var companyId;
        var userId;
        var companyName;

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
            multiSelect: false,
            minRowsToShow: 10,
            columnDefs: [{
                field: 'username',
                displayName: 'Username',
                minWidth: 100,
                width: 150,
                enableCellEdit: true,
                headerCellClass: uc.highlightFilteredHeader
            }, {
                field: 'email',
                displayName: 'Email',
                minWidth: 200,
                headerCellClass: uc.highlightFilteredHeader
            }, {
                field: 'application.bulletlead.usertype',
                displayName: 'Role',
                minWidth: 100,
                width: 120,
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [{
                        value: 'Admin',
                        label: 'Admin'
                    }, {
                        value: 'User',
                        label: 'User'
                    }]
                },
                cellFilter: 'mapRole',
                headerCellClass: uc.highlightFilteredHeader,
                editDropdownValueLabel: 'role',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownOptionsArray: [{
                    id: 'Admin',
                    role: 'Admin'
                }, {
                    id: 'User',
                    role: 'User'
                }]
            }, ],
        };

        //get company id from cookie
        if (authServices.getToken()) {
            companyId = authServices.getUserInfo().companyId;
            userId = authServices.getUserInfo().userId;
            companyName = authServices.getUserInfo().companyName;
        }

        if (angular.isDefined(companyId)) {
            // get data from server
            allUsersData.getUserData(companyId).then(function successCallback(res) {
                    uc.gridOptions.data = res.data;
                    console.log('get users');
                }),
                function errorCallback(err) {
                    console.log('Cannot get users');
                };
        }

        //add new user
        uc.addData = function() {
            var n = uc.gridOptions.data.length + 1;
            uc.gridOptions.data.push({
                "username": uc.lead.userName,
                "email": uc.lead.email,
                "application": {
                    "bulletlead": {
                        "usertype": uc.lead.role
                    }
                }
            });


            var newUser = {
                username: uc.lead.userName,
                email: uc.lead.email,
                password: uc.lead.password,
                companyId: companyId,
                companyName: companyName,

            };

            newUser.application = {};
            newUser.application.bulletlead = {};
            newUser.application.bulletlead.isUser = true;
            newUser.application.bulletlead.usertype = uc.lead.role;

            allUsersData.addUserData(newUser).then(function successCallback(res) {
                console.log('Added');
                addFeedback();
                uc.closeDialog('addUser');
            }).catch(function errorCallback(err) {
                console.log('Unable to add user');
            });

        };

        //delete selected leads
        uc.deleteSelected = function() {
            angular.forEach(uc.gridApi.selection.getSelectedRows(), function(data, index) {
                uc.gridOptions.data.splice(uc.gridOptions.data.lastIndexOf(data), 1);
            });

            var selectedUsersToDelete = uc.gridApi.selection.getSelectedRows();
            console.log(selectedUsersToDelete[0]._id);

            allUsersData.deleteUserData(selectedUsersToDelete[0]._id).then(function successCallback(res) {
                return feedbackServices.hideFeedback('#userManagementFeedback').
                then(feedbackServices.successFeedback('Deleted!', '#userManagementFeedback', 2000));

            }).catch(function errorCallback(err) {
                return feedbackServices.hideFeedback('#userManagementFeedback').
                then(feedbackServices.successFeedback(err.data, '#userManagementFeedback', 2000));
            });
        };

        uc.gridOptions.onRegisterApi = function(gridApi) {
            uc.gridApi = gridApi;

            //save after edit
            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                $scope.$apply();
                allUsersData.editUserData(rowEntity, rowEntity._id)
                    .then(function(res) {
                        $window.location.reload();
                    });

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

        var addFeedback = function() {
            feedbackServices.successFeedback("Added!", '#userManagementFeedback');
        };

        /* =========================================== Load animation =========================================== */
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
    }
])


//filter drop down option hashing
.filter('mapRole', function() {
    var roleHash = {
        'Admin': 'Admin',
        'User': 'User'
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