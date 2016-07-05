app.controller('googleController', ['$scope', 'googleResults', 'ypResults', 'shareData','sendCountry', '$http', 'uiGridConstants', '$q', '$location', '$timeout', '$interval', 'shareInput',
                function ($scope, googleResults, ypResults, shareData, sendCountry, $http, uiGridConstants, $q, $location, $timeout, $interval, shareInput) {
  
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
      { field: 'phone', displayName: 'Phone No.', headerCellClass: gc.highlightFilteredHeader },
      { field: 'category', displayName: 'Category', headerCellClass: gc.highlightFilteredHeader },
    ],
    onRegisterApi: function( gridApi ) {
      gc.gridApi = gridApi;
    }
  };
  
    //filter for ui-grid
    gc.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
        if ( col.filters[0].term ) {
            return 'header-filtered';
        } else {
          return '';
        }
    };

    //get user input
    gc.category = shareInput.getCategory();
    gc.country = shareInput.getCountry();
    
    gc.dataListForGoogle = [];
    gc.dataListForYP = [];
    // gc.forContinueScraping = [];
    gc.numScrap = 0;
    gc.messageNoScrap = "No more websites available";

    //get data from json file (google api)
    // console.log('getting data from google');
    googleResults.firstTimeScrape(gc.category,gc.country).then(function successCallback(res) {
        gc.dataListForGoogle = res.data;
        // console.log('google res is ' + res.data);
    }), function errorCallback(err) {
        console.log('err is ' + err);
    };

    // console.log('getting data from yellow page');
    ypResults.scrapeYellowPageLeads(gc.category).then(function successCallback(res) {
        gc.dataListForYP = res.data;
        // console.log('yellow page res is ' + res.data);

    }), function errorCallback(err) {
        console.log('err is ' + err);
    };
    
    var stop;
    var count = 0;

    gc.transfer = function() {
        console.log('the server is ' + navigator.onLine);
        if (angular.isDefined(stop) /*&& stop !== 1*/) {
            return;
        
        } else if (navigator.onLine === false) {
            console.log('2.the server is ' + navigator.onLine);
            gc.pauseScraping();

        } else if (navigator.onLine === true) {

            showInternet(navigator.onLine);

        stop = $interval(function() {
            if (gc.dataListForGoogle.length > 0 && navigator.onLine === true) {
                var popLead = gc.dataListForGoogle.pop();
                gc.gridOptions.data.push(popLead);
                gc.numScrap = gc.gridOptions.data.length;
                shareData.addLead(popLead);

            } else if (gc.dataListForYP.length > 0 && navigator.onLine === true) {
                var popYPLead = gc.dataListForYP.pop();
                console.log('yp pop lead is ' + popYPLead.firstName);
                
                gc.gridOptions.data.push(popYPLead);
                gc.numScrap = gc.gridOptions.data.length;
                shareData.addLead(popYPLead);
            
            // if there is no internet connection, stop scraping, ask for internet
            } else if (navigator.onLine === false) {
                console.log('3.the server is ' + navigator.onLine);
                gc.pauseScraping();
                showInternet(navigator.onLine);

            } else {
                console.log('continue scraping');
                googleResults.continueScrape(gc.category,gc.country).then(function successCallback(res) {
                    // signal to stop scraping
                    if (angular.isDefined(res.data.status) && res.data.status === 205) {
                        gc.stopScraping();
                        //show the 'view results' button
                        gc.showFunction();
                    } else if (angular.isDefined(res.data.status)) {
                        gc.stopScraping();
                        gc.showFunction();
                    } else {
                        console.log('res is ' + res.data);
                        gc.dataListForGoogle = res.data;
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
    }
    

    gc.pauseScraping = function() {
        if(angular.isDefined(stop) /*&& stop !== 1*/) {
            $interval.cancel(stop);
            stop = undefined;
            
        }
    }

    //if press stop button, cannot continue scraping
    gc.pressStop = false;
    gc.stopScraping = function() {
        if(angular.isDefined(stop)) {
            $interval.cancel(stop);
            gc.pressStop = true;
            //stop = 1;
        }
    }

    gc.showResult = false;
    gc.showFunction = function() {
        gc.showResult = true;
    };

    //online = true, offline = false
    var checkOnline = navigator.onLine;
    gc.status = false;

    var showInternet = function(checkOnline) {
        if (checkOnline === true) {
            gc.status = false;
        } else if (checkOnline === false) {
            gc.status = true;
        }
    }

}]);