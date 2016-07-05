app.controller('blackListController', ['$scope','domainsData', 'blackLeadsData', '$http', '$interval', 'uiGridConstants', '$q', '$location', '$timeout', function ($scope, domainsData, blackLeadsData, $http, $interval, uiGridConstants, $q, $location, $timeout) {

  blackLeadsData.success(function(data) {
    $scope.gridOptions.data = data;
  });

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
    minRowsToShow: 10,
    columnDefs: [
      { field: 'firstName', displayName: 'First Name', minWidth:80, width:200, enableCellEdit: true,  headerCellClass: $scope.highlightFilteredHeader },
      { field: 'lastName', displayName: 'Last Name', minWidth:80, width:200, headerCellClass: $scope.highlightFilteredHeader },
      { field: 'company', displayName: 'Company', minWidth:80, width:200, headerCellClass: $scope.highlightFilteredHeader },
      { field: 'email', displayName: 'Email', enableCellEdit: false, minWidth:80, width:250, headerCellClass: $scope.highlightFilteredHeader },
      { field: 'phone', displayName: 'Phone', enableCellEdit: false, minWidth:80, width:100, headerCellClass: $scope.highlightFilteredHeader },
      { field: 'category', displayName: 'Category', minWidth:80, width:150, headerCellClass: $scope.highlightFilteredHeader },
      { field: "type", displayName: "Type", editableCellTemplate: "ui-grid/dropdownEditor", minWidth:80, width:150, 
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
    ],
  };

//delete selected leads
  $scope.deleteSelected = function(){
    angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
    $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
    });
    var leads = $scope.gridApi.selection.getSelectedRows();
    var deleteStatus = $http.put("http://localhost:8080/api/contacts/blackList", leads);
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
})