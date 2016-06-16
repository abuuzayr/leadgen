app.controller('googleController', ['$scope', 'googleResults', 'shareData','$http', 'uiGridConstants', '$q', '$location', '$timeout', '$interval', '$anchorScroll', function ($scope, googleResults, shareData, $http, uiGridConstants, $q, $location, $timeout, $interval, $anchorScroll) {
  
    var gc = this;

   gc.displayList = [];
   gc.numScrap = 0;
   gc.dataList = [];
   gc.resultList = [];

   gc.totalLeads = 0;

    //get data from json file (google api)
    googleResults
        .success(function(data){
            gc.dataList = data;
            // console.log('printing ' + gc.dataList);
            // console.log('print again ' + gc.dataList[0].name);
            // console.log('print again ' + gc.dataList[1].name);
            gc.totalLeads = gc.dataList.length;
        console.log('total leads length is ' + gc.totalLeads);
        });

    var stop;
    gc.transfer = function() {
        if(angular.isDefined(stop) && stop !== 1) return;

        stop = $interval(function() {
            if(gc.dataList.length > 0) {
                var popLead = gc.dataList.pop();
                console.log('pop lead is ' + popLead);
                gc.displayList.push(popLead);
                gc.numScrap = gc.displayList.length;
                // console.log('length of displaylist is ' + gc.numScrap);
                // console.log('setting data');
                shareData.addLead(popLead);

            } else {
                gc.stopScraping();
            }
        },1000);
    };

    gc.pauseScraping = function() {
        if(angular.isDefined(stop) && stop !== 1) {
            $interval.cancel(stop);
            stop = undefined;
            
        }
    }

    gc.stopScraping = function() {
        if(angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = 1;
        }
    }




    //filter for ui-grid
    gc.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
    if( col.filters[0].term ){
      return 'header-filtered';
    } else {
      return '';
    }
  };
  
  gc.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    data: 'gc.displayList',
    columnDefs: [
      { field: 'name', headerCellClass: gc.highlightFilteredHeader },
      { field: 'email', headerCellClass: gc.highlightFilteredHeader  },
      { field: 'company', enableSorting: false },
      { field: 'number', headerCellClass: gc.highlightFilteredHeader }
    ],
    onRegisterApi: function( gridApi ) {
      gc.gridApi = gridApi;
    }
  };

    /*gc.gridOptionsTwo = {
    enableSorting: true,
    enableFiltering: true,
    data: 'gc.displayList',
    columnDefs: [
      { field: 'name', headerCellClass: gc.highlightFilteredHeader },
      { field: 'email', headerCellClass: gc.highlightFilteredHeader  },
      { field: 'company', enableSorting: false },
      { field: 'number', headerCellClass: gc.highlightFilteredHeader }
    ],
    onRegisterApi: function( gridApi ) {
      gc.gridApi = gridApi;
    }
  };*/
}]);