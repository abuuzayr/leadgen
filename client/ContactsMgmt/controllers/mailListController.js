app.controller('mailListController', ['$scope', '$mdDialog', '$mdMedia', '$window', 'mailListData', 'shareMailList', '$http', '$interval', 'uiGridConstants', '$q', '$location', '$timeout', function($scope, $mdDialog, $mdMedia, $window, mailListData, shareMailList, $http, $interval, uiGridConstants, $q, $location, $timeout) {

  var mc = this;

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

  //refresh
  mc.refresh = function() {
    $window.location.reload();
  }

  //view details
  mc.showView = function(value) {
    shareMailList.setData(value);
  };

  //add new mailing list
  mc.addMailList = function() {
    var n = mc.gridOptions.data.length + 1;
    mc.gridOptions.data.push({
      "listName": mc.mailListName,
      "subscribers": 0
    });
    var mailingList = {
      "listName": mc.mailListName,
      "subscribers": 0
    };
    var addStatus = $http.post("http://10.4.1.145:8080/api/contacts/mailingList", mailingList);
    $window.location.reload();
  };

  //delete selected lists
  mc.deleteSelected = function() {
    var mailingLists = mc.gridApi.selection.getSelectedRows();
    $http.put("http://10.4.1.145:8080/api/contacts/mailingList", mailingLists)
    .then(function successCallback(data){
      if (data.status === 200) {
        angular.forEach(mc.gridApi.selection.getSelectedRows(), function(data, index) {
            mc.gridOptions.data.splice(mc.gridOptions.data.lastIndexOf(data), 1);
        });
      }
      else {
        mc.showAlert();
      }
    },function errorCallback(error){
	console.log(error.status);
    });
    
       // $window.location.reload();
  };

  mc.gridOptions.onRegisterApi = function(gridApi) {
    mc.gridApi = gridApi;
    //save after edit
    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
      console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
      $scope.$apply();
      var obj = {};
      obj[colDef.name] = newValue;
      var editData = [rowEntity, obj]
      var editStatus = $http.patch("http://10.4.1.145:8080/api/contacts/mailingList", editData);
      $window.location.reload();
    });
  };

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
