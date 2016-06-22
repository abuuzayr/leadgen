app.controller('resultController', ['$scope', 'shareData', 'sendResults', '$http', 'uiGridConstants', '$q', '$location', '$timeout', '$interval', '$anchorScroll', function ($scope, shareData, sendResults, $http, uiGridConstants, $q, $location, $timeout, $anchorScroll) {

    var rc = this;
    rc.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    data:[],
    columnDefs: [
      { field: 'firstName', displayName: 'First Name', headerCellClass: rc.highlightFilteredHeader },
      { field: 'lastName', displayName: 'Last Name', headerCellClass: rc.highlightFilteredHeader },
      { field: 'email', displayName: 'Email', headerCellClass: rc.highlightFilteredHeader },
      { field: 'company', displayName: 'Company', headerCellClass: rc.highlightFilteredHeader },
      { field: 'number', displayName: 'Phone No.', headerCellClass: rc.highlightFilteredHeader },
      { field: 'category', displayName: 'Category', headerCellClass: rc.highlightFilteredHeader },
    ],
    onRegisterApi: function( gridApi ) {
      rc.gridApi = gridApi;
    }
  };

    rc.gridOptions.data = shareData.getData();
    rc.resultsLength = rc.gridOptions.data.length;
    
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
    }, 1500);
  };
  
  rc.deleteSelected = function() {
      angular.forEach(rc.gridApi.selection.getSelectedRows(), function (data, index) {
        rc.gridOptions.data.splice(rc.gridOptions.data.lastIndexOf(data), 1);
        rc.resultsLength -= 1;
      });
    }

  rc.responseMessage = "";
  rc.symbol = true;

  rc.saveToContacts = function() {
    var myJsonString = JSON.stringify(rc.gridOptions.data);
    var response = $http.post('/api/Corporate/scrap',myJsonString);
    response.success(function(data) {
      rc.responseMessage = "Saved to Contacts!";
    });
    response.error(function(data) {
      rc.responseMessage = "Error Occured";
      rc.symbol = false;
    })
  }

  // rc.print = function() {
  //   console.log('print leads after delete');
  //   console.log(rc.gridOptions.data);
  // };
  
  rc.postResponse = ""; 

  // sendResults.sendLeads(rc.gridOptions.data).then(function successCallback(res) {
  //   rc.postResponse = "Saved to Contacts!";
  // }), function errorCallback(err) {
  //   rc.postResponse = "Unable to Save to Contacts";
  //   rc.symbol = false;
  // }

}]);