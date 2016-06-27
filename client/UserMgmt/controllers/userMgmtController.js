app.controller('userMgmtController', ['$scope', '$http', 'allUsersData', 'uiGridConstants', '$q', '$location', '$timeout', function ($scope, $http, allUsersData, uiGridConstants, $q, $location, $timeout) {
    var uc = this;

    uc.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
    if( col.filters[0].term ){
      return 'header-filtered';
    } else {
      return '';
    }
  };

  uc.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    showGridFooter:true,
    columnDefs: [
      { field: 'firstName', displayName: 'First Name', enableCellEdit: true,  headerCellClass: uc.highlightFilteredHeader },
      { field: 'lastName', displayName: 'Last Name', headerCellClass: uc.highlightFilteredHeader },
      { field: 'role', displayName: 'Role', filter: {
        type: uiGridConstants.filter.SELECT,
        selectOptions: [ { value: '1', label: 'Admin' }, { value: '2', label: 'User' } ]
        },
        cellFilter: 'mapType', headerCellClass: uc.highlightFilteredHeader },
      { field: 'email', displayName: 'Email', headerCellClass: uc.highlightFilteredHeader },
      { field: 'phone', displayName: 'Phone', headerCellClass: uc.highlightFilteredHeader },
    ],
  };

  allUsersData.success(function(data) {
    uc.gridOptions.data = data;
    console.log(data);
  });
  
  //add new lead
   uc.addData = function() {
    var n = uc.gridOptions.data.length + 1;
    uc.gridOptions.data.push({
                "firstName": uc.lead.first,
                "lastName": uc.lead.last,
                "role": uc.lead.role,
                "email": uc.lead.email,
                "phone": uc.lead.phone,
              });
    uc.addResult = "Success!";
  };

//delete selected leads
  uc.deleteSelected = function(){
      angular.forEach(uc.gridApi.selection.getSelectedRows(), function (data, index) {
        uc.gridOptions.data.splice(uc.gridOptions.data.lastIndexOf(data), 1);
      });
    }

// add field
  uc.addField = function() {
    var fieldName = uc.field.name;
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
    uc.gridOptions.columnDefs.push({field: lowerName, displayName: display, enableSorting: true });
    uc.addResult = "Success!";
  }

// delete field
  uc.deleteField = function() {
    console.log(uc.gridOptions.columnDefs[0]);
    for (var x in uc.gridOptions.columnDefs) {
      if((uc.gridOptions.columnDefs[x].displayName === uc.fieldSelected)) {
        uc.gridOptions.columnDefs.splice(x,1);
      } 
    }
  }

  uc.gridOptions.onRegisterApi= function ( gridApi ) {
      uc.gridApi = gridApi;

      //save after edit
      gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue) ;
            $scope.$apply();
          });
    };

    //popup dialog box
    uc.openDialog = function(dialogName) {
        var dialog = document.querySelector('#' + dialogName);
        if (! dialog.showModal) {
          dialogPolyfill.registerDialog(dialog);
        }
            dialog.showModal();
        };
        uc.closeDialog = function(dialogName) {
            var dialog = document.querySelector('#' + dialogName);
            dialog.close();
        };
   
}])


//filter drop down option hashing
.filter('mapType', function() {
  var typeHash = {
    1: 'Admin',
    2: 'User'
  };

  return function(input) {
    if (!input){
      console.log('input is ' + input);
      return 'error';
    } else {
      return typeHash[input];
    }
  };
});
