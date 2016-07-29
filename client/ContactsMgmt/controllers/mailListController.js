  app.controller('mailListController', ['$scope', 'appConfig', '$mdDialog', '$mdMedia', '$window', 'mailListData', 'shareMailList', '$http', '$interval', 'uiGridConstants', '$q', '$location', '$timeout', function($scope, appConfig, $mdDialog, $mdMedia, $window, mailListData, shareMailList, $http, $interval, uiGridConstants, $q, $location, $timeout) {

      var mc = this;

      /** This is used to get the all the mailing lists from database */
      mailListData.success(function(data) {
          mc.gridOptions.data = data;
      });

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

      mc.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
          if (col.filters[0].term) {
              return 'header-filtered';
          } else {
              return '';
          }
      };

      mc.gridOptions = {
          enableSorting: true,
          enableFiltering: true,
          showGridFooter: true,
          multiSelect: false,
          columnDefs: [{
              field: 'name',
              displayName: 'List Name',
              minWidth: 150,
              width: 540,
              enableCellEdit: true,
              headerCellClass: mc.highlightFilteredHeader,
          }, {
              field: 'subscribers',
              displayName: 'Subscribers',
              minWidth: 150,
              width: 250,
              enableFiltering: false,
              enableCellEdit: false
          }, {
              field: 'details',
              displayName: 'Details',
              minWidth: 100,
              width: 120,
              enableCellEdit: false,
              enableFiltering: false,
              enableSorting: false,
              cellTemplate: ' <a ui-sref="viewmaillist"><button class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect" ng-click="grid.appScope.mc.showView(row.entity)"><i class="material-icons md-48">zoom_in</i></button></a>'
          }],
      };

      /** 
       * This method refreshes the page. 
       * It is used to update the data shown in UI-Grid
       */
      mc.refresh = function() {
          $window.location.reload();
      };

      /**
       * This method takes in a row entity (mailing list) as it’s parameter. 
       * It sets the specific row entity as the data for the shareMailList service 
       * such that viewMailListController is able to retrieve the entity via the same service.
       */
      mc.showView = function(value) {
          shareMailList.setData(value);
      };

      /** This method adds a new mailing list into the database based on the data retrieve using ng-model */
      mc.addMailList = function() {
          var n = mc.gridOptions.data.length + 1;
          mc.gridOptions.data.push({
              "name": mc.mailListName,
              "subscribers": 0
          });

          var mailingList = {
              "name": mc.mailListName,
              "subscribers": 0
          };
          var url = "/contacts/mailingList";
          addStatus = $http.post(appConfig.API_URL + url, mailingList)
              .then(function successCallback(res) {
                  mc.closeDialog('addMailList');
                  //   $window.location.reload();
              });
      };

      /**
       * This method deletes the selected mailing list
       * It also updates the database
       * @param {} mailingList - The selected mailing list to be deleted
       */
      mc.deleteSelected = function() {
          var mailingList = mc.gridApi.selection.getSelectedRows();
          var url = "/contacts/mailingList";
          $http.put(appConfig.API_URL + url, mailingList)
              .then(function successCallback(data) {
                  angular.forEach(mc.gridApi.selection.getSelectedRows(), function(data, index) {
                      mc.gridOptions.data.splice(mc.gridOptions.data.lastIndexOf(data), 1);
                  });
                  $window.location.reload();
              }, function errorCallback(error) {
                  mc.showAlert();
              });
      };

      /**
       * This method is used to update the UI Grid after editing
       * PATCH - update database
       * @param [] - cell to edit
       */
      mc.gridOptions.onRegisterApi = function(gridApi) {
          mc.gridApi = gridApi;
          //save after edit
          gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
              console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
              $scope.$apply();
              var obj = {};
              obj[colDef.name] = newValue;
              var editData = [rowEntity, obj];
              var url = "/contacts/mailingList";
              editStatus = $http.patch(appConfig.API_URL + url, editData).then(function successCallback(res) {
                  $window.location.reload();
              });
          });
      };

      /** This method displays a popup dialog to show a failure message upon failure to delete mailing list. */
      mc.showAlert = function() {
          var dialog = document.querySelector('#showFailure');
          dialog.showModal();
      };

      function DialogController($scope, $mdDialog) {
          $scope.hide = function() {
              $mdDialog.hide();
          };

          $scope.cancel = function() {
              $mdDialog.cancel();
          };
      }

      //popup dialog box
      mc.openDialog = function(dialogName) {
          var dialog = document.querySelector('#' + dialogName);
          if (!dialog.showModal) {
              dialogPolyfill.registerDialog(dialog);
          }
          dialog.showModal();
      };

      mc.closeDialog = function(dialogName) {
          var dialog = document.querySelector('#' + dialogName);
          dialog.close();
      };
  }]);