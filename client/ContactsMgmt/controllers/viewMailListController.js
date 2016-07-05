app.controller('viewMailListController', ['$scope','detailedMailListData','shareMailList','$http', '$interval', 'uiGridConstants', '$q', '$location', '$timeout', function ($scope, detailedMailListData, shareMailList, $http, $interval, uiGridConstants, $q, $location, $timeout) {
   
  $scope.mailListResult = shareMailList.getData();

  detailedMailListData.getMailListData($scope.mailListResult).then(function successCallback(res) {
    $scope.gridOptions.data = res.data;
    }), function errorCallback(err) {
      console.log('err is ' + err);
    };

  var viewContentLoaded = $q.defer();
  $scope.$on('$viewContentLoaded', function () {
    $timeout(function () {
      viewContentLoaded.resolve();
    }, 0);
  });
  viewContentLoaded.promise.then(function () {
    $timeout(function () {
      componentHandler.upgradeDom();
    }, 0);
  });

  $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
    if( col.filters[0].term ){
      return 'header-filtered';
    } else {
      return '';
    }
  };

  $scope.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    showGridFooter:true,
      columnDefs: [
      { field: 'firstName', displayName: 'First Name', minWidth:80, width:150, enableCellEdit: true,  headerCellClass: $scope.highlightFilteredHeader },
      { field: 'lastName', displayName: 'Last Name', minWidth:80, width:150, headerCellClass: $scope.highlightFilteredHeader },
      { field: 'company', displayName: 'Company', minWidth:80, width:150, headerCellClass: $scope.highlightFilteredHeader },
      { field: 'email', displayName: 'Email', enableCellEdit: false, minWidth:80, width:200, headerCellClass: $scope.highlightFilteredHeader },
      { field: 'phone', displayName: 'Phone', enableCellEdit: false, minWidth:80, width:150, headerCellClass: $scope.highlightFilteredHeader },
      { field: 'category', displayName: 'Category', minWidth:80, width:120, headerCellClass: $scope.highlightFilteredHeader },
      { field: "type", displayName: "Type", editableCellTemplate: "ui-grid/dropdownEditor", minWidth:80, width:120, 
        filter: {
          type: uiGridConstants.filter.SELECT,
          selectOptions: [ { value: "1", label: "Corporate" }, { value: "2", label: "Consumer"} ]
        },
        cellFilter: "mapType", editDropdownValueLabel: "type", headerCellClass: $scope.highlightFilteredHeader,
        editDropdownOptionsArray: [
          { id: 1, type: "Corporate" },
          { id: 2, type: "Consumer" }
        ]
      },
      { field: 'status', displayName: 'Status', editableCellTemplate: "ui-grid/dropdownEditor", minWidth:80, width:150, 
        filter: {
          type: uiGridConstants.filter.SELECT,
          selectOptions: [ { value: '1', label: 'Subscribed' }, { value: '2', label: 'Unsubscribed' } ]
        },
        cellFilter: 'mapStatus', editDropdownValueLabel: "status", headerCellClass: $scope.highlightFilteredHeader,
        editDropdownOptionsArray: [
          { id: 1, status: "Subscribed" },
          { id: 2, status: "Unsubscribed" }
        ]
      }
    ],
  };

//delete selected leads
  $scope.deleteSelected = function(){
    angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
      $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
    });
    var leads = $scope.gridApi.selection.getSelectedRows();
    var deleteStatus = $http.put("http://localhost:8080/api/contacts/mailingList/subscriber", leads);
  }

  $scope.gridOptions.onRegisterApi= function ( gridApi ) {
    $scope.gridApi = gridApi;
    //save after edit
    gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
      console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue) ;
      $scope.$apply();
    });
  };  

  //popup dialog box
  $scope.openDialog = function(dialogName) {
    var dialog = document.querySelector('#' + dialogName);
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    dialog.showModal();
  };

  $scope.closeDialog = function(dialogName) {
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
    if (!input){
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
    if (!input){
      return 'Unselected';
    } else {
      return typeHash[input];
    }
  };
});