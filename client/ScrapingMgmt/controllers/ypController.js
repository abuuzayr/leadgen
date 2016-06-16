app.controller('ypController', ['$scope', 'ypResults', '$http', 'uiGridConstants', '$q', '$location', '$timeout', function ($scope, ypResults, $http, uiGridConstants, $q, $location, $timeout) {
  
    var yp = this;

    //get data from json file (google api)
    ypResults
        .success(function(data){
            yp.gridOptions.data = data;
        });

    //filter for ui-grid
    yp.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
    if( col.filters[0].term ){
      return 'header-filtered';
    } else {
      return '';
    }
  };
  
  yp.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    columnDefs: [
      { field: 'name', headerCellClass: yp.highlightFilteredHeader },
      { field: 'email', headerCellClass: yp.highlightFilteredHeader  },
      { field: 'company', enableSorting: false },
      { field: 'number', headerCellClass: yp.highlightFilteredHeader }
    ],
    onRegisterApi: function( gridApi ) {
      yp.gridApi = gridApi;
    }
  };
}]);