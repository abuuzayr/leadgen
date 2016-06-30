app.controller('consumerResultController', ['$scope', 'consumerShareData', 'sendResults', '$http', 'uiGridConstants', '$q', '$location', '$timeout', '$interval', '$anchorScroll', function ($scope, consumerShareData, sendResults, $http, uiGridConstants, $q, $location, $timeout, $anchorScroll) {

    var cr = this;
    cr.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    data:[],
    columnDefs: [
      { field: 'firstName', displayName: 'First Name', headerCellClass: cr.highlightFilteredHeader },
      { field: 'lastName', displayName: 'Last Name', headerCellClass: cr.highlightFilteredHeader },
      { field: 'email', displayName: 'Email', headerCellClass: cr.highlightFilteredHeader },
      { field: 'company', displayName: 'Company', headerCellClass: cr.highlightFilteredHeader },
      { field: 'number', displayName: 'Phone No.', headerCellClass: cr.highlightFilteredHeader },
      { field: 'category', displayName: 'Category', headerCellClass: cr.highlightFilteredHeader },
    ],
    onRegisterApi: function( gridApi ) {
      cr.gridApi = gridApi;
    }
  };

    cr.gridOptions.data = consumerShareData.getData();
    cr.resultsLength = cr.gridOptions.data.length;
    
    //filter for ui-grid
    cr.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
    if( col.filters[0].term ){
      return 'header-filtered';
    } else {
      return '';
    }
  };

  cr.showResult = false;
  
  cr.showFunction = function() {
    cr.showResult = true;
    $timeout(function () { 
      cr.showResult = false; 
    }, 1500);
  };
  
  cr.deleteSelected = function() {
      angular.forEach(cr.gridApi.selection.getSelectedRows(), function (data, index) {
        cr.gridOptions.data.splice(cr.gridOptions.data.lastIndexOf(data), 1);
        cr.resultsLength -= 1;
      });
    }

  cr.responseMessage = "";
  cr.symbol = true;

  cr.saveToContacts = function() {
    var myJsonString = JSON.stringify(cr.gridOptions.data);
    var response = $http.post('/api/Corporate/scrap',myJsonString);
    response.success(function(data) {
      cr.responseMessage = "Saved to Contacts!";
    });
    response.error(function(data) {
      cr.responseMessage = "Error Occured";
      cr.symbol = false;
    })
  }

  // rc.print = function() {
  //   console.log('print leads after delete');
  //   console.log(rc.gridOptions.data);
  // };
  
  cr.postResponse = ""; 

  // sendResults.sendLeads(rc.gridOptions.data).then(function successCallback(res) {
  //   rc.postResponse = "Saved to Contacts!";
  // }), function errorCallback(err) {
  //   rc.postResponse = "Unable to Save to Contacts";
  //   rc.symbol = false;
  // }

}]);