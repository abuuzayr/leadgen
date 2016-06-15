app.controller('scrapMainController', ['$scope', 'leadsResult', '$http', 'uiGridConstants', '$q', '$location', '$timeout', function ($scope, leadsResult, $http, uiGridConstants, $q, $location, $timeout) {
    
    //get data from json file
    leadsResult.success(function(data) {
    vm.gridOptions.data = data;
    });
    
    var vm = this;

    // get leads from backend
    // store leads data to vm.leads
    /*leadsResult.get(vm.input.category,vm.input.country)
      .success(function(data) {
        vm.leads = data;
      });*/

    //filter for ui-grid
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
      { field: 'name', headerCellClass: vm.highlightFilteredHeader },
      { field: 'email', headerCellClass: vm.highlightFilteredHeader  },
      { field: 'company', enableSorting: false },
      { field: 'number', headerCellClass: vm.highlightFilteredHeader }
    ],
    onRegisterApi: function( gridApi ) {
      vm.gridApi = gridApi;
    }
  };
}]);