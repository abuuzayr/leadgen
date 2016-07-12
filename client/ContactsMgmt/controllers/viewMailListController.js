app.controller('viewMailListController', ['$scope', '$window', 'detailedMailListData', 'shareMailList', '$http', '$interval', 'uiGridConstants', '$q', '$location', '$timeout', function($scope, $window, detailedMailListData, shareMailList, $http, $interval, uiGridConstants, $q, $location, $timeout) {

  var vmc = this;

  vmc.mailListResult = shareMailList.getData();

  detailedMailListData.getMailListData(vmc.mailListResult).then(function successCallback(res) {
      vmc.gridOptions.data = res.data;
    }),
    function errorCallback(err) {
      console.log('err is ' + err);
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

  vmc.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
    if (col.filters[0].term) {
      return 'header-filtered';
    } else {
      return '';
    }
  };

  vmc.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    showGridFooter: true,
    enableCellEdit: false,
    columnDefs: [{
      field: 'firstName',
      displayName: 'First Name',
      minWidth: 80,
      width: 150,
      headerCellClass: vmc.highlightFilteredHeader
    }, {
      field: 'lastName',
      displayName: 'Last Name',
      minWidth: 80,
      width: 150,
      headerCellClass: vmc.highlightFilteredHeader
    }, {
      field: 'company',
      displayName: 'Company',
      minWidth: 80,
      width: 150,
      headerCellClass: vmc.highlightFilteredHeader
    }, {
      field: 'email',
      displayName: 'Email',
      minWidth: 80,
      width: 200,
      headerCellClass: vmc.highlightFilteredHeader
    }, {
      field: 'phone',
      displayName: 'Phone',
      minWidth: 80,
      width: 150,
      headerCellClass: vmc.highlightFilteredHeader
    }, {
      field: 'category',
      displayName: 'Category',
      minWidth: 80,
      width: 120,
      headerCellClass: vmc.highlightFilteredHeader
    }, {
      field: "type",
      displayName: "Type",
      editableCellTemplate: "ui-grid/dropdownEditor",
      minWidth: 80,
      width: 120,
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
      headerCellClass: vmc.highlightFilteredHeader,
      editDropdownOptionsArray: [{
        id: 1,
        type: "Corporate"
      }, {
        id: 2,
        type: "Consumer"
      }]
    }, {
      field: 'status',
      displayName: 'Status',
      editableCellTemplate: "ui-grid/dropdownEditor",
      minWidth: 80,
      width: 150,
      filter: {
        type: uiGridConstants.filter.SELECT,
        selectOptions: [{
          value: '1',
          label: 'Subscribed'
        }, {
          value: '2',
          label: 'Unsubscribed'
        }]
      },
      cellFilter: 'mapStatus',
      editDropdownValueLabel: "status",
      headerCellClass: vmc.highlightFilteredHeader,
      editDropdownOptionsArray: [{
        id: 1,
        status: "Subscribed"
      }, {
        id: 2,
        status: "Unsubscribed"
      }]
    }],
  };

  //refresh
  vmc.refresh = function() {
    $window.location.reload();
  };

  //delete selected leads
  vmc.deleteSelected = function() {
    angular.forEach(vmc.gridApi.selection.getSelectedRows(), function(data, index) {
      vmc.gridOptions.data.splice(vmc.gridOptions.data.lastIndexOf(data), 1);
    });
    var leads = $vmc.gridApi.selection.getSelectedRows();
    var deleteStatus = $http.put("http://10.4.1.145:8080/api/contacts/mailingList/subscriber", leads);
    $window.location.reload();
  };

  vmc.gridOptions.onRegisterApi = function(gridApi) {
    vmc.gridApi = gridApi;
    //save after edit
    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
      console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
      $scope.$apply();
      $window.location.reload();
    });
  };

  //popup dialog box
  vmc.openDialog = function(dialogName) {
    var dialog = document.querySelector('#' + dialogName);
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    dialog.showModal();
  };

  vmc.closeDialog = function(dialogName) {
    var dialog = document.querySelector('#' + dialogName);
    dialog.close();
  };
}])

//filter drop down option hashing
.filter('mapStatus', function() {
  var statusHash = {
    1: 'Subscribed',
    2: 'Unsubscribed'
  };

  return function(input) {
    if (!input) {
      return 'error';
    } else {
      return statusHash[input];
    }
  };
})

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