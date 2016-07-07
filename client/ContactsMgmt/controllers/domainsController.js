app.controller('domainsController', ['$scope', '$window', 'domainsData', '$http', '$interval', 'uiGridConstants', '$q', '$location', '$timeout', function ($scope, $window, domainsData, $http, $interval, uiGridConstants, $q, $location, $timeout) {
   
 domainsData.success(function(data) {
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
    showGridFooter:true,
    enableFiltering: true,
    enableSorting: true,
    minRowsToShow: 4,
    columnDefs: [
      { field: 'domain', displayName: 'Domain', enableCellEdit: true, headerCellClass: $scope.highlightFilteredHeader}
    ],
  };

  //refresh
  $scope.refresh = function() {
    $window.location.reload();
  }

  // add domain
  $scope.addDomain = function() {
    var domain = $scope.domainSelected;
    var arrName = domain.split(" ");
    var editedDomain = "";
    for (var x of arrName) {
      if (x!== "") {
        editedDomain += x;
        }
    } 
    $scope.gridOptions.data.push({"domain" : editedDomain});
    $scope.addResult = "Success!";
    var domain = {"domain" : editedDomain};
    var addStatus = $http.post("http://localhost:8080/api/contacts/blackList/domain",domain);
    $window.location.reload();
  }

  $scope.selectDeleteDomain = function() {
    $scope.selectedDeleteDomain = $scope.domainSelected;
    console.log($scope.selectedDeleteDomain);
  }

  // delete domain
  $scope.deleteDomain = function() {
    console.log($scope.selectedDeleteDomain);
    for (var x in $scope.gridOptions.data) {
      if(($scope.gridOptions.data[x].domain === $scope.selectedDeleteDomain)) {
        var domain = $scope.gridOptions.data.splice(x,1);
        var deleteStatus = $http.put("http://localhost:8080/api/contacts/blackList/domain", domain);
        $window.location.reload();
      } 
    }
  }

  $scope.gridOptions.onRegisterApi= function ( gridApi ) {
    $scope.gridApi = gridApi;
    //save after edit
    gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
      console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue) ;
      $scope.$apply();
      $window.location.reload();
    });
  }; 
}])
