app.controller('contactsMainController', ['$scope', '$http', 'uiGridConstants', '$q', '$location', '$timeout', function ($scope, $http, uiGridConstants, $q, $location, $timeout) {
   
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
    columnDefs: [
      { field: 'firstName', headerCellClass: $scope.highlightFilteredHeader },
      { field: 'lastName', headerCellClass: $scope.highlightFilteredHeader  },
      { field: 'company', enableSorting: false },
      { field: 'employed', filter: {
        term: true,
        type: uiGridConstants.filter.SELECT,
        selectOptions: [ { value: true, label: 'true' }, { value: false, label: 'false' } ]
        },
        cellFilter: 'mapEmployed', headerCellClass: $scope.highlightFilteredHeader },
    ],
    onRegisterApi: function( gridApi ) {
      $scope.gridApi = gridApi;
    }
  };

    $scope.gridOptions.data = [
    {
        "firstName": "Cox",
        "lastName": "Carney",
        "company": "Enormo",
        "employed": true
    },
    {
        "firstName": "Lorraine",
        "lastName": "Wise",
        "company": "Comveyer",
        "employed": false
    },
    {
        "firstName": "Nancy",
        "lastName": "Waters",
        "company": "Fuelton",
        "employed": false
    }
];   
}])

.filter('mapEmployed', function() {
  var employedHash = {
    true: 'true',
    false: 'false'
  };

  return function(input) {
    if (!input){
      return 'false';
    } else {
      return employedHash[input];
    }
  };
});

