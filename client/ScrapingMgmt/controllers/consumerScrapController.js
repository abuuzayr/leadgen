app.controller('consumerScrapController', ['$scope', 'consumerLeads', 'consumerShareData', '$http', 'uiGridConstants', '$q', '$location', '$timeout', '$interval',
                function ($scope, consumerLeads, consumerShareData, $http, uiGridConstants, $q, $location, $timeout, $interval) {
  
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

   cs.dataList = [];
   cs.numScrap = 0;
   cs.messageNoScrap = "No more websites available";

   cs.input = {};

    //get data from json file
    consumerLeads.getConsumerLeads(cs.input.category).then(function successCallback(res) {
        cs.dataList = res.data;
        // console.log('res is ' + res.data);
        // console.log('length is ' + gc.dataListForGoogle.length);
    }), function errorCallback(err) {
        console.log('err is ' + err);
    };
    
    var stop;
    var count = 0;

    cs.transfer = function() {
        if(angular.isDefined(stop)) {
            return;

        } else if (navigator.onLine === false) {
            // console.log('2.the server is ' + navigator.onLine);
            gc.pauseScraping();

        } else if (navigator.onLine === true) {
            showInternet(navigator.onLine);

            stop = $interval(function() {
            if (cs.dataList.length > 0) {
                var popLead = cs.dataList.pop();           
                cs.gridOptions.data.push(popLead);
                cs.numScrap = cs.gridOptions.data.length;
                consumerShareData.addLead(popLead);
 
            // if there is no internet connection, stop scraping, ask for internet
            } else if (navigator.onLine === false) {
                // console.log('3.the server is ' + navigator.onLine);
                gc.pauseScraping();
                showInternet(navigator.onLine);
            
            } else {
                // console.log('continue scraping');
                consumerLeads.getConsumerLeads(cs.input.category).then(function successCallback(res) {
                    if (angular.isDefined(res.data.status)) {
                        cs.stopScraping();
                        //show the 'view results' button
                        cs.showFunction();
                    } else {
                        // console.log('res is ' + res.data);
                        cs.dataList = res.data;
                        // console.log('length is ' + cs.dataListForGoogle.length);
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
    }

    cs.pauseScraping = function() {
        if(angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
            
        }
    }

    //if press stop button, cannot continue scraping
    cs.pressStop = false;
    cs.stopScraping = function() {
        if(angular.isDefined(stop)) {
            $interval.cancel(stop);
            cs.pressStop = true;
        }
    }

    cs.showResult = false; 
    cs.showFunction = function() {
        cs.showResult = true;
    };

    //online = true, offline = false
    var checkOnline = navigator.onLine;
    cs.status = false;

    var showInternet = function(checkOnline) {
        if (checkOnline === true) {
            cs.status = false;
        } else if (checkOnline === false) {
            cs.status = true;
        }
    }

}]);