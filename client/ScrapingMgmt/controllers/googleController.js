app.controller('googleController', ['$scope', 'googleResults', 'ypResults', 'shareData','$http', 'uiGridConstants', '$q', '$location', '$timeout', '$interval',
                function ($scope, googleResults, ypResults,shareData, $http, uiGridConstants, $q, $location, $timeout, $interval) {
  
    var gc = this;
    gc.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    data: [],
    columnDefs: [
      { field: 'firstName', displayName: 'First Name', headerCellClass: gc.highlightFilteredHeader },
      { field: 'lastName', displayName: 'Last Name', headerCellClass: gc.highlightFilteredHeader },
      { field: 'email', displayName: 'Email', headerCellClass: gc.highlightFilteredHeader },
      { field: 'company', displayName: 'Company', headerCellClass: gc.highlightFilteredHeader },
      { field: 'number', displayName: 'Phone No.', headerCellClass: gc.highlightFilteredHeader },
      { field: 'category', displayName: 'Category', headerCellClass: gc.highlightFilteredHeader },
    ],
    onRegisterApi: function( gridApi ) {
      gc.gridApi = gridApi;
    }
  };

  //filter for ui-grid
    gc.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
        if( col.filters[0].term ){
         return 'header-filtered';
        } else {
          return '';
        }
    };

   gc.dataListForGoogle = [];
   gc.dataListForYP = [];
   gc.numScrap = 0;
   gc.messageNoScrap = "No more websites available";

   gc.input = {};

    //get data from json file (google api)
    console.log('getting data from google');
    googleResults.firstTimeScrape().then(function successCallback(res) {
        // console.log('res is ' + res.data);
        gc.dataListForGoogle = res.data;
        // console.log('length is ' + gc.dataListForGoogle.length);
    }), function errorCallback(err) {
        console.log('err is ' + err);
    };

    console.log('getting data from yellow page');
    ypResults.scrapeYellowPageLeads().then(function successCallback(res) {
        // console.log('res is ' + res.data);
        gc.dataListForYP = res.data;
        // console.log('length is ' + gc.dataListForGoogle.length);
    }), function errorCallback(err) {
        console.log('err is ' + err);
    };

    //googleResults.getGoogleLeads(gc.input.category,gc.input.country);
    
    // get data from json file (yellow page)
    
    var stop;
    var count = 0;

    gc.transfer = function() {
        if(angular.isDefined(stop) /*&& stop !== 1*/) return;

        stop = $interval(function() {
            if (gc.dataListForGoogle.length > 0) {
                var popLead = gc.dataListForGoogle.pop();
                console.log('pop lead is ' + popLead);
                
                gc.gridOptions.data.push(popLead);
                gc.numScrap = gc.gridOptions.data.length;
                shareData.addLead(popLead);

            } else if (gc.dataListForYP.length > 0) {
                var popYPLead = gc.dataListForYP.pop();
                console.log('yp pop lead is ' + popLead);
                
                gc.gridOptions.data.push(popYPLead);
                gc.numScrap = gc.gridOptions.data.length;
                shareData.addLead(popYPLead);

            } else {
                console.log('continue scraping');
                googleResults.continueScrape().then(function successCallback(res) {
                    if (angular.isDefined(res.data.status)) {
                        gc.stopScraping();
                        //show the 'view results' button
                        gc.showFunction();
                    } else {
                        console.log('res is ' + res.data);
                        gc.dataListForGoogle = res.data;
                        console.log('length is ' + gc.dataListForGoogle.length);
                    }     
            }), function errorCallback(err) {
                    console.log('err is ' + err);
                    gc.stopScraping();
                    //show the 'view results' button
                    gc.showFunction();
                };
            }
        },2000);
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
}]);