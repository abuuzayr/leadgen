app.controller('viewMailListController', ['$scope','detailedMailListData','shareMailList','$http', '$interval', 'uiGridConstants', '$q', '$location', '$timeout', function ($scope, detailedMailListData, shareMailList, $http, $interval, uiGridConstants, $q, $location, $timeout) {
   
    detailedMailListData.success(function(data) {
    $scope.gridOptions.data = data;
  });

$scope.mailListResult = shareMailList.getData();

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
      { field: 'firstName', displayName: 'First Name', enableCellEdit: true,  headerCellClass: $scope.highlightFilteredHeader },
      { field: 'lastName', displayName: 'Last Name', headerCellClass: $scope.highlightFilteredHeader },
      { field: 'company', displayName: 'Company', headerCellClass: $scope.highlightFilteredHeader },
      { field: 'email', displayName: 'Email', headerCellClass: $scope.highlightFilteredHeader },
      { field: 'phone', displayName: 'Phone', headerCellClass: $scope.highlightFilteredHeader },
      { field: 'category', displayName: 'Category', headerCellClass: $scope.highlightFilteredHeader },
      { field: 'type', displayName: 'Type', filter: {
        type: uiGridConstants.filter.SELECT,
        selectOptions: [ { value: '1', label: 'Corporate' }, { value: '2', label: 'Consumer' } ]
        },
        cellFilter: 'mapType', headerCellClass: $scope.highlightFilteredHeader },
      { field: 'status', displayName: 'Status', filter: {
        type: uiGridConstants.filter.SELECT,
        selectOptions: [ { value: '1', label: 'Subscribed' }, { value: '2', label: 'Unsubscribed' } ]
        },
        cellFilter: 'mapStatus', headerCellClass: $scope.highlightFilteredHeader }
    ],
  };

//delete selected leads
  $scope.deleteSelected = function(){
      angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
        $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
      });
    }

  $scope.gridOptions.onRegisterApi= function ( gridApi ) {
      $scope.gridApi = gridApi;

      //save after edit
      gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue) ;
            $scope.$apply();
          });
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
      return 'error';
    } else {
      return typeHash[input];
    }
  };
});