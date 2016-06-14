app.controller('contactsMainController', ['$scope', 'leadsData', '$http', 'uiGridConstants', '$q', '$location', '$timeout', function ($scope, leadsData, $http, uiGridConstants, $q, $location, $timeout) {
   
    leadsData.success(function(data) {
    vm.gridOptions.data = data;
  });

    var vm = this;
  //    var viewContentLoaded = $q.defer();
  //       $scope.$on('$viewContentLoaded', function () {
  //           $timeout(function () {
  //               viewContentLoaded.resolve();
  //           }, 0);
  //       });
  //       viewContentLoaded.promise.then(function () {
  //           $timeout(function () {
  //               componentHandler.upgradeDom();
  //           }, 0);
  //       });

    vm.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
    if( col.filters[0].term ){
      return 'header-filtered';
    } else {
      return '';
    }
  };

  vm.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    columnDefs: [
      { field: 'firstName', headerCellClass: vm.highlightFilteredHeader },
      { field: 'lastName', headerCellClass: vm.highlightFilteredHeader  },
      { field: 'company', enableSorting: false },
      { field: 'employed', filter: {
        term: true,
        type: uiGridConstants.filter.SELECT,
        selectOptions: [ { value: true, label: 'true' }, { value: false, label: 'false' } ]
        },
        cellFilter: 'mapEmployed', headerCellClass: vm.highlightFilteredHeader },
    ],
    onRegisterApi: function( gridApi ) {
      vm.gridApi = gridApi;
    }
  };
}])

.filter('mapEmployed', function() {
  var employedHash = {
    true: 'true',
    false: 'false'
  };

  return function(input) {
    if (!input){
      return 'false';
    } else {
      return employedHash[input];
    }
  };
});

