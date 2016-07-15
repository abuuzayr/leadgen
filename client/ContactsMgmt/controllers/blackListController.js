app.controller('blackListController', ['$scope', '$window', 'domainsData', 'blackLeadsData', '$http', '$interval', 'uiGridConstants', '$q', '$location', '$timeout', function($scope, $window, domainsData, blackLeadsData, $http, $interval, uiGridConstants, $q, $location, $timeout) {

  var bc = this;

  blackLeadsData.success(function(data) {
    bc.gridOptions.data = data;
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

  bc.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
    if (col.filters[0].term) {
      return 'header-filtered';
    } else {
      return '';
    }
  };

  bc.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    showGridFooter: true,
    minRowsToShow: 10,
    columnDefs: [{
      field: 'firstName',
      displayName: 'First Name',
      minWidth: 80,
      width: 200,
      enableCellEdit: true,
      headerCellClass: bc.highlightFilteredHeader
    }, {
      field: 'lastName',
      displayName: 'Last Name',
      minWidth: 80,
      width: 200,
      headerCellClass: bc.highlightFilteredHeader
    }, {
      field: 'company',
      displayName: 'Company',
      minWidth: 80,
      width: 200,
      headerCellClass: bc.highlightFilteredHeader
    }, {
      field: 'email',
      displayName: 'Email',
      enableCellEdit: false,
      minWidth: 80,
      width: 250,
      headerCellClass: bc.highlightFilteredHeader
    }, {
      field: 'phone',
      displayName: 'Phone',
      enableCellEdit: false,
      minWidth: 80,
      width: 100,
      headerCellClass: bc.highlightFilteredHeader
    }, {
      field: 'category',
      displayName: 'Category',
      minWidth: 80,
      width: 150,
      headerCellClass: bc.highlightFilteredHeader
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
      headerCellClass: bc.highlightFilteredHeader,
      editDropdownOptionsArray: [{
        id: 1,
        type: "Corporate"
      }, {
        id: 2,
        type: "Consumer"
      }]
    }, ],
  };

  //refresh
  bc.refresh = function() {
    $window.location.reload();
  }

  //delete selected leads
  bc.deleteSelected = function() {
    angular.forEach(bc.gridApi.selection.getSelectedRows(), function(data, index) {
      bc.gridOptions.data.splice(bc.gridOptions.data.lastIndexOf(data), 1);
    });
    var leads = bc.gridApi.selection.getSelectedRows();
    var deleteStatus = $http.put("//10.4.145/api/contacts/blackList", leads);
    $window.location.reload();
  }

  bc.gridOptions.onRegisterApi = function(gridApi) {
    bc.gridApi = gridApi;
    //save after edit
    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
      console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
      $scope.$apply();
      $window.location.reload();
    });
  };

  //popup dialog box
  bc.openDialog = function(dialogName) {
    var dialog = document.querySelector('#' + dialogName);
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    dialog.showModal();
  };

  bc.closeDialog = function(dialogName) {
    var dialog = document.querySelector('#' + dialogName);
    dialog.close();
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
})