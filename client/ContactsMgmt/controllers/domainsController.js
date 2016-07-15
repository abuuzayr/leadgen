app.controller('domainsController', ['$scope', 'appConfig', '$window', 'domainsData', '$http', '$interval', 'uiGridConstants', '$q', '$location', '$timeout', function($scope, appConfig, $window, domainsData, $http, $interval, uiGridConstants, $q, $location, $timeout) {

  var dc = this;

  domainsData.success(function(data) {
    dc.gridOptions.data = data;
  });

  var viewContentLoaded = $q.defer();
  $scope.$on('$viewContentLoaded', function() {
    $timeout(function() {
      viewContentLoaded.resolve();
    }, 0);
  });
  viewContentLoaded.promise.then(function() {
    $timeout(function() {
      componentHandler.upgradeDom();
    }, 0);
  });

  dc.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
    if (col.filters[0].term) {
      return 'header-filtered';
    } else {
      return '';
    }
  };

  dc.gridOptions = {
    showGridFooter: true,
    enableFiltering: true,
    enableSorting: true,
    minRowsToShow: 4,
    columnDefs: [{
      field: 'domain',
      displayName: 'Domain',
      enableCellEdit: true,
      headerCellClass: dc.highlightFilteredHeader
    }],
  };

  //refresh
  dc.refresh = function() {
    $window.location.reload();
  };

  // add domain
  dc.addDomain = function() {
    var domain = dc.domainSelected;
    var arrName = domain.split(" ");
    var editedDomain = "";
    for (var x of arrName) {
      if (x !== "") {
        editedDomain += x;
      }
    }
    dc.gridOptions.data.push({
      "domain": editedDomain
    });
    
    var domain = {
      "domain": editedDomain
    };
    var url = "/contacts/blackList/domain";
    var addStatus = $http.post(appConfig.API_URL + url, domain);
    $window.location.reload();
  }

  dc.selectDeleteDomain = function() {
    dc.selectedDeleteDomain = dc.domainSelected;
    console.log(dc.selectedDeleteDomain);
  };

  // delete domain
  dc.deleteDomain = function() {
    console.log(dc.selectedDeleteDomain);
    for (var x in dc.gridOptions.data) {
      if ((dc.gridOptions.data[x].domain === dc.selectedDeleteDomain)) {
        var domain = dc.gridOptions.data.splice(x, 1);
        var url = "/contacts/blackList/domain";
        var deleteStatus = $http.put(appConfig.API_URL + url, domain[0]);
        $window.location.reload();
      }
    }
  }

  dc.gridOptions.onRegisterApi = function(gridApi) {
    dc.gridApi = gridApi;
    //save after edit
    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
      console.log('edited row id:' + rowEntity.firstName + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
      $scope.$apply();
      $window.location.reload();
    });
  };

   //popup dialog box
  dc.openDialog = function(dialogName) {
    var dialog = document.querySelector('#' + dialogName);
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    dialog.showModal();
  };

  dc.closeDialog = function(dialogName) {
    var dialog = document.querySelector('#' + dialogName);
    dialog.close();
  };

}]);