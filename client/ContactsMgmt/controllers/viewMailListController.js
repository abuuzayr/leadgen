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
  
  //add new lead
   $scope.addData = function() {
    var n = $scope.gridOptions.data.length + 1;
    $scope.gridOptions.data.push({
                "firstName": $scope.lead.first,
                "lastName": $scope.lead.last,
                "company": $scope.lead.company,
                "employed": $scope.lead.employed,
              });
    $scope.addResult = "Success!";
  };

//delete selected leads
  $scope.deleteSelected = function(){
      angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
        $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
      });
    }

// add field
  $scope.addField = function() {
    var fieldName = $scope.field.name;
    var arrName = fieldName.split(" ");
    var editedField = "";
    var editedDisplay = "";
    for (var x of arrName) {
      if (y!== "") {
        editedField += x;
        }
    } 
    for (var y of arrName) {
      if (y!== "") {
        editedDisplay += y;
        editedDisplay += " ";
      }
    } 
    var display = editedDisplay.slice(0,editedDisplay.length-1);
    var lowerName = editedField.toLowerCase();
    $scope.gridOptions.columnDefs.push({field: lowerName, displayName: display, enableSorting: true });
    $scope.addResult = "Success!";
  }

// delete field
  $scope.deleteField = function() {
    console.log($scope.gridOptions.columnDefs[0]);
    for (var x in $scope.gridOptions.columnDefs) {
      if(($scope.gridOptions.columnDefs[x].displayName === $scope.fieldSelected)) {
        $scope.gridOptions.columnDefs.splice(x,1);
      } 
    }
  }

  $scope.gridOptions.onRegisterApi= function ( gridApi ) {
      $scope.gridApi = gridApi;

      //save after edit
      gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue) ;
            $scope.$apply();
          });
    };

    //popup dialog box
    // $scope.openDialog = function(dialogName) {
    //     var dialog = document.querySelector('#' + dialogName);
    //     if (! dialog.showModal) {
    //       dialogPolyfill.registerDialog(dialog);
    //     }
    //         dialog.showModal();
    //     };
    //     $scope.closeDialog = function(dialogName) {
    //         var dialog = document.querySelector('#' + dialogName);
    //         dialog.close();
    //     };
   
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