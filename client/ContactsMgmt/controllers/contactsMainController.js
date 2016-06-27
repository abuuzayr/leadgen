app.controller('contactsMainController', ['$scope','leadsData', 'historyData', 'mailListData', '$http', '$interval', 'uiGridConstants', '$q', '$location', '$timeout', function ($scope, leadsData, historyData, mailListData, $http, $interval, uiGridConstants, $q, $location, $timeout) {
   
    leadsData.success(function(data) {
    $scope.gridOptions.data = data;
  });

    historyData.success(function(data) {
    $scope.history = data;
  });

  mailListData.success(function(data) {
    $scope.mailingList = data;
  });

  document.getElementById('get_file').onclick = function() {
    document.getElementById('files').click();
};

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
    importerDataAddCallback: function ( grid, newObjects ) {
      $scope.gridOptions.data = $scope.gridOptions.data.concat( newObjects );
    },
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
      { field: 'success', displayName: 'Success', headerCellClass: $scope.highlightFilteredHeader },
      { field: 'failure', displayName: 'Failure', headerCellClass: $scope.highlightFilteredHeader },
      { field: 'history', displayName: 'History', enableFiltering: false, enableSorting: false, enableEdit: false, cellTemplate:'<button class="btn primary" ng-click="grid.appScope.showMe(row.entity.firstName)">View</button>', headerCellClass: $scope.highlightFilteredHeader }
    ],
  };
  
    $scope.showMe = function(value){
      $scope.userID = value;
      var dialog = document.getElementById('historyData');
      dialog.showModal();
      };

  //add new lead
   $scope.addData = function() {
    var n = $scope.gridOptions.data.length + 1;
    $scope.gridOptions.data.push({
                "firstName": $scope.lead.first,
                "lastName": $scope.lead.last,
                "company": $scope.lead.company,
                "email": $scope.lead.email,
                "phone": $scope.lead.phone,
                "category": $scope.lead.category,
                "type": $scope.lead.type,
                "success": 0,
                "failure": 0,
                "history": '',
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

// add leads to mailing list
  $scope.addToMailingList = function() {
    console.log($scope.listSelected);
    var y = $scope.gridApi.selection.getSelectedRows();
    console.log(y[0]);
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
    $scope.openDialog = function(dialogName) {
        var dialog = document.querySelector('#' + dialogName);
        if (! dialog.showModal) {
          dialogPolyfill.registerDialog(dialog);
        }
            dialog.showModal();
        };
        $scope.closeDialog = function(dialogName) {
            var dialog = document.querySelector('#' + dialogName);
            $scope.addResult= "";
            dialog.close();
        };

//import function
  var handleFileSelect = function( event ){
    var target = event.srcElement || event.target;
    
    if (target && target.files && target.files.length === 1) {
      var fileObject = target.files[0];
      console.log("abc");
      $scope.gridApi.importer.importFile( fileObject );
      target.form.reset();
    }
  };
   
  var fileChooser = document.querySelectorAll('.file-chooser');
  if ( fileChooser.length !== 1 ){
    console.log('Found > 1 or < 1 file choosers within the menu item, error, cannot continue');
  } else {
    fileChooser[0].addEventListener('change', handleFileSelect, false);  // TODO: why the false on the end?  Google  
    console.log("def");
  }
   
}])


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

