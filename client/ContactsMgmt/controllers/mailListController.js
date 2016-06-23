app.controller('mailListController', ['$scope','mailListData','shareMailList','$http', '$interval', 'uiGridConstants', '$q', '$location', '$timeout', function ($scope, mailListData, shareMailList, $http, $interval, uiGridConstants, $q, $location, $timeout) {
   
    mailListData.success(function(data) {
    $scope.gridOptions.data = data;
  });

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
      { field: 'listName', displayName: 'List Name', enableCellEdit: true,  headerCellClass: $scope.highlightFilteredHeader, },
      { field: 'subscribers', displayName: 'Subscribers', enableFiltering: false, enableCellEdit: false },
      { field: 'details', displayName: 'Details', enableCellEdit: false, enableFiltering: false, enableSorting: false,  cellTemplate:' <a ui-sref="viewmaillist"><button class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect" ng-click="grid.appScope.showView(row.entity.listName)"><i class="material-icons md-48">zoom_in</i></button></a>'}
    ],
  };


  //view details
   $scope.showView = function(value){
                   shareMailList.setData(value);
                };

  //add new mailing list
   $scope.addMailList = function() {
    var n = $scope.gridOptions.data.length + 1;
    $scope.gridOptions.data.push({
                "listName": $scope.mailListName,
                "subscribers": 0
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
    $scope.openDialog = function(dialogName) {
        var dialog = document.querySelector('#' + dialogName);
        if (! dialog.showModal) {
          dialogPolyfill.registerDialog(dialog);
        }
            dialog.showModal();
        };
        $scope.closeDialog = function(dialogName) {
            var dialog = document.querySelector('#' + dialogName);
            dialog.close();
        };
   
}])
;