app.controller('resultController', ['$scope', 'shareData', '$http', 'uiGridConstants', '$q', '$location', '$timeout', '$interval', '$anchorScroll', function ($scope, shareData, $http, uiGridConstants, $q, $location, $timeout, $anchorScroll) {
  
    var rc = this;
    rc.displayResult = shareData.getData();
    rc.resultsLength = rc.displayResult.length;
    //filter for ui-grid
    rc.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
    if( col.filters[0].term ){
      return 'header-filtered';
    } else {
      return '';
    }
  };
  
  rc.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    data: 'rc.displayResult',
    columnDefs: [
      { field: 'name', headerCellClass: rc.highlightFilteredHeader },
      { field: 'email', headerCellClass: rc.highlightFilteredHeader  },
      { field: 'company', enableSorting: false },
      { field: 'number', headerCellClass: rc.highlightFilteredHeader }
    ],
    onRegisterApi: function( gridApi ) {
      rc.gridApi = gridApi;
    }
  };

  
}]);