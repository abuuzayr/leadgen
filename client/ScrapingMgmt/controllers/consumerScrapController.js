app.controller('consumerScrapController', ['$scope', 'googleResults', 'ypResults', 'consumerShareData', '$http', 'uiGridConstants', '$q', '$location', '$timeout', '$interval',
                function ($scope, googleResults, ypResults, consumerShareData, $http, uiGridConstants, $q, $location, $timeout, $interval) {
  
    var cs = this;
    cs.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    data: [],
    columnDefs: [
      { field: 'firstName', displayName: 'First Name', headerCellClass: cs.highlightFilteredHeader },
      { field: 'lastName', displayName: 'Last Name', headerCellClass: cs.highlightFilteredHeader },
      { field: 'email', displayName: 'Email', headerCellClass: cs.highlightFilteredHeader },
      { field: 'company', displayName: 'Company', headerCellClass: cs.highlightFilteredHeader },
      { field: 'number', displayName: 'Phone No.', headerCellClass: cs.highlightFilteredHeader },
      { field: 'category', displayName: 'Category', headerCellClass: cs.highlightFilteredHeader },
    ],
    onRegisterApi: function( gridApi ) {
      cs.gridApi = gridApi;
    }
  };

  //filter for ui-grid
    cs.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
        if( col.filters[0].term ){
         return 'header-filtered';
        } else {
          return '';
        }
    };

   cs.dataListForGoogle = [];
   cs.dataListForYP = [];
   cs.numScrap = 0;
   cs.messageNoScrap = "No more websites available";

   cs.input = {};

    //get data from json file (google api)
    console.log('getting data from google');
    googleResults.firstTimeScrape().then(function successCallback(res) {
        // console.log('res is ' + res.data);
        cs.dataListForGoogle = res.data;
        // console.log('length is ' + gc.dataListForGoogle.length);
    }), function errorCallback(err) {
        console.log('err is ' + err);
    };

    console.log('getting data from yellow page');
    ypResults.scrapeYellowPageLeads().then(function successCallback(res) {
        // console.log('res is ' + res.data);
        cs.dataListForYP = res.data;
        // console.log('length is ' + gc.dataListForGoogle.length);
    }), function errorCallback(err) {
        console.log('err is ' + err);
    };

    //googleResults.getGoogleLeads(gc.input.category,gc.input.country);
    
    // get data from json file (yellow page)
    
    var stop;
    var count = 0;

    cs.transfer = function() {
        if(angular.isDefined(stop) /*&& stop !== 1*/) return;

        stop = $interval(function() {
            if (cs.dataListForGoogle.length > 0) {
                var popLead = cs.dataListForGoogle.pop();
                console.log('pop lead is ' + popLead);
                
                cs.gridOptions.data.push(popLead);
                cs.numScrap = cs.gridOptions.data.length;
                consumerShareData.addLead(popLead);

            } else if (cs.dataListForYP.length > 0) {
                var popYPLead = cs.dataListForYP.pop();
                console.log('yp pop lead is ' + popLead);
                
                cs.gridOptions.data.push(popYPLead);
                cs.numScrap = cs.gridOptions.data.length;
                consumerShareData.addLead(popYPLead);

            } else {
                console.log('continue scraping');
                googleResults.continueScrape().then(function successCallback(res) {
                    if (angular.isDefined(res.data.status)) {
                        cs.stopScraping();
                        //show the 'view results' button
                        cs.showFunction();
                    } else {
                        console.log('res is ' + res.data);
                        cs.dataListForGoogle = res.data;
                        console.log('length is ' + cs.dataListForGoogle.length);
                    }     
            }), function errorCallback(err) {
                    console.log('err is ' + err);
                    cs.stopScraping();
                    //show the 'view results' button
                    cs.showFunction();
                };
            }
        },2000);
    };

    cs.pauseScraping = function() {
        if(angular.isDefined(stop) /*&& stop !== 1*/) {
            $interval.cancel(stop);
            stop = undefined;
            
        }
    }

    //if press stop button, cannot continue scraping
    cs.stopScraping = function() {
        if(angular.isDefined(stop)) {
            $interval.cancel(stop);
            //stop = 1;
        }
    }

    cs.showResult = false;
    cs.scrapMessage = "Scraping Stopped";
    
    cs.showFunction = function() {
        cs.showResult = true;
    };

}]);