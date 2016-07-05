app.controller('consumerResultController', ['$scope', 'consumerShareData', 'sendResults', '$http', 'uiGridConstants', '$q', '$location', '$timeout', '$interval', function ($scope, consumerShareData, sendResults, $http, uiGridConstants, $q, $location, $timeout) {

    var cr = this;
    
    cr.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    minRowsToShow: 10,
    data:[],
    columnDefs: [
      { field: 'firstName', displayName: 'First Name', minWidth:80, width:150, headerCellClass: cr.highlightFilteredHeader },
      { field: 'lastName', displayName: 'Last Name', minWidth:80, width:150, headerCellClass: cr.highlightFilteredHeader },
      { field: 'email', displayName: 'Email', minWidth:80, width:200, headerCellClass: cr.highlightFilteredHeader },
      { field: 'company', displayName: 'Company', minWidth:80, width:150, headerCellClass: cr.highlightFilteredHeader },
      { field: 'phone', displayName: 'Phone No.', minWidth:80, width:150, headerCellClass: cr.highlightFilteredHeader },
      { field: 'category', displayName: 'Category', minWidth:80, width:150, headerCellClass: cr.highlightFilteredHeader },
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

  cr.clearData = function() {
    consumerShareData.clearData();
  }

  var dataToContacts = [];

  cr.addSelected = function () {
    dataToContacts= [];
    angular.forEach(cr.gridApi.selection.getSelectedRows(), function (data, index) {
      dataToContacts.push(data);
      console.log('1.selected data is ' + dataToContacts);
      console.log('2.data is ' + data);

      // callback();
    });
  }

  cr.saveToContacts = function() {
    var myJsonString;
    console.log('3.selected data is ' + dataToContacts);

    // if none selected, save all
    if (dataToContacts.length === 0) {
        myJsonString = JSON.stringify(cr.gridOptions.data);
    } else {
      //save the selected contacts
      myJsonString = JSON.stringify(dataToContacts);
    }

    sendResults.sendLeads(myJsonString).then(function successCallback(res) {
      cr.responseMessage = "Saved to Contacts!";
    }), function errorCallback(err) {
      cr.responseMessage = "Error Occured";
      cr.symbol = false;
    };
  }

}]);