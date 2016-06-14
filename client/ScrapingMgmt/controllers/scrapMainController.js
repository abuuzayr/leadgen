app.controller('scrapMainController', ['$scope', 'leadsResult', '$http', 'uiGridConstants', '$q', '$location', '$timeout', function ($scope, leadsResult, $http, uiGridConstants, $q, $location, $timeout) {
    
    leadsResult.success(function(data) {
    vm.gridOptions.data = data;
  });
    var vm = this;

    //store category and country
    vm.fields = {};

    vm.getData = function() {

        vm.fields.push({
            category: vm.scrapData.category,
            country: vm.scrapData.country
        });

        //clear after fields has been added
        vm.scrapData = {};
    }

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