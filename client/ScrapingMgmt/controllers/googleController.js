app.controller('googleController', ['$scope', 'googleResults', 'ypResults', 'shareData','$http', 'uiGridConstants', '$q', '$location', '$timeout', '$interval', 
                function ($scope, googleResults, ypResults,shareData, $http, uiGridConstants, $q, $location, $timeout, $interval) {
  
    var gc = this;

   gc.displayList = [];
   gc.dataList = [];
   gc.dataListForYP = [];
   gc.numScrap = 0;
   gc.totalLeads = 0;
   gc.messageNoScrap = "No more websites available";

   gc.input = {};

    //get data from json file (google api)
    googleResults
        .success(function(data){
            gc.dataList = data;
            gc.totalLeads = gc.dataList.length;
        // console.log('total leads length is ' + gc.totalLeads);
        });

    //googleResults.getGoogleLeads(gc.input.category,gc.input.country);
    
    // get data from json file (yellow page)
    ypResults
        .success(function(data) {
            gc.dataListForYP = data;
        })

    var stop;
    gc.transfer = function() {
        if(angular.isDefined(stop) /*&& stop !== 1*/) return;

        stop = $interval(function() {
            if (gc.dataList.length > 0) {
                var popLead = gc.dataList.pop();
                console.log('pop lead is ' + popLead);
                gc.displayList.push(popLead);
                gc.numScrap = gc.displayList.length;
                shareData.addLead(popLead);

            } else if (gc.dataListForYP.length > 0) {
                var popYPLead = gc.dataListForYP.pop();
                console.log('yp pop lead is ' + popLead);
                gc.displayList.push(popYPLead);
                gc.numScrap = gc.displayList.length;
                shareData.addLead(popYPLead);

            } else {
                gc.stopScraping();
                //show the 'view results' button
                gc.showFunction();
            }
        },1000);
    };

    gc.pauseScraping = function() {
        if(angular.isDefined(stop) /*&& stop !== 1*/) {
            $interval.cancel(stop);
            stop = undefined;
            
        }
    }

    //if press stop button, cannot continue scraping
    gc.stopScraping = function() {
        if(angular.isDefined(stop)) {
            $interval.cancel(stop);
            //stop = 1;
        }
    }

    gc.showResult = false;
    gc.scrapMessage = "Scraping Stopped";
    gc.showFunction = function() {
        gc.showResult = true;
    };

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
}]);