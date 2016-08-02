(function() {
    'use strict';
    app.controller('userMgmtController', ['$scope', '$window', '$http', 'allUsersData', 'uiGridConstants', '$q', '$location', '$timeout', 'authServices', 'feedbackServices',
        function($scope, $window, $http, allUsersData, uiGridConstants, $q, $location, $timeout, authServices, feedbackServices) {
            var uc = this;
            var companyId;
            var userId;
            var companyName;
            uc.lead = {};


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

            //Obtain information from cookie
            if (authServices.getToken()) {
                companyId = authServices.getUserInfo().companyId;
                userId = authServices.getUserInfo().userId;
                companyName = authServices.getUserInfo().companyName;
            }

            if (angular.isDefined(companyId)) {
                // get users from database
                allUsersData.getUserData(companyId).then(function successCallback(res) {
                    uc.gridOptions.data = res.data;
                    console.log('get users');
                }).catch(function(err) {
                    console.log('Cannot get users');
                });
            }

            /** 
             * Add user to UI Grid and update database
             * if return 409, means user already exists, cannot add user to database
             * @param {Object} newUser
             */
            uc.addData = function() {
                var n = uc.gridOptions.data.length + 1;
                // uc.gridOptions.data.push({
                //     "username": uc.lead.userName,
                //     "email": uc.lead.email,
                //     "application": {
                //         "bulletlead": {
                //             "usertype": uc.lead.role
                //         }
                //     }
                // });


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
                uc.showMessage = '';

                allUsersData.addUserData(newUser)
                    .then(function successCallback(res) {

                        console.log('Added');
                        // addFeedback();
                        uc.closeDialog('addUser');

                        uc.lead.userName = '';
                        uc.lead.email = '';
                        uc.lead.role = '';
                        uc.lead.password = '';

                        uc.gridOptions.data.push({
                            "username": uc.lead.userName,
                            "email": uc.lead.email,
                            "application": {
                                "bulletlead": {
                                    "usertype": uc.lead.role
                                }
                            }
                        });

                    }).catch(function errorCallback(err) {
                        if (err.status === 409) {
                            uc.showMessage = 'Username/Email already exists';
                        }
                        console.log('Unable to add user');
                    });
            };

            /** Close dialog and refresh the page to update UI Grid */
            uc.closeAndRefresh = function() {
                uc.closeDialog('addUser');
                $window.location.reload();
            };

            /**
             * This method retrieves and removes the selected rows from UI-Grid table
             *  and deletes the data from the database. The page will be reloaded when
             *  deleting the lead from the database is successful to update the UI-Grid
             *  @param {Object} selectedUsersToDelete - The selected rows to delete
             */
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

            var colName = '';
            var editedValue = '';
            var row = {};

            uc.gridOptions.onRegisterApi = function(gridApi) {
                uc.gridApi = gridApi;

                //save after edit
                gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                    uc.openDialog('editUser');
                    $scope.$apply();
                    row = rowEntity;
                });
            };

            /** 
             * Confirms edit 
             * editUserData - updates database, then refreshes page
             */
            uc.editUser = function(gridApi) {
                uc.gridApi = gridApi;

                if (angular.isDefined(row)) {
                    allUsersData.editUserData(row, row._id)
                        .then(function(res) {
                            console.log('success');
                            uc.closeDialog('editUser');
                            $window.location.reload();
                        });
                }
            };

            /** Undo edit and refresh page */
            uc.cancelEdit = function() {
                uc.closeDialog('editUser');
                $window.location.reload();
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

            /**
             * This method refreshes the page.
             * It is used to update the data shown in UI-Grid
             */
            uc.refresh = function() {
                $window.location.reload();
            };

            var addFeedback = function() {
                feedbackServices.successFeedback("Added!", '#userManagementFeedback');
            };

            // var deleteFeedback = function() {
            //     feedbackServices.successFeedback("Deleted!", '#addFeedbackID');
            // };

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
})();