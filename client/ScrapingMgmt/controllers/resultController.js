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

  rc.showResult = false;
  
  rc.showFunction = function() {
    rc.showResult = true;
    $timeout(function () { 
      rc.showResult = false; 
    }, 2000);
  };

  rc.deleteRow = function(row) {
    var index = rc.gridOptions.data.indexOf(row.entity);
    rc.gridOptions.data.splice(index, 1);
  }

  rc.responseMessage = "";
  rc.symbol = true;

  rc.saveToContacts = function() {
    var myJsonString = JSON.stringify(rc.displayResult);
    var response = $http.post('/api/Corporate/scrap',myJsonString);
    response.success(function(data) {
      rc.responseMessage = "Saved to Contacts!";
    });
    response.error(function(data) {
      rc.responseMessage = "Error Occured";
      rc.symbol = false;
    })
  }
  
  rc.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    data: 'rc.displayResult',
    columnDefs: [
      { field: 'select', enableSorting:false, enableFiltering:false, cellTemplate: '<input type="checkbox" name="selectCheckBox" ng-click="rc.deleteRow(row)">' },
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