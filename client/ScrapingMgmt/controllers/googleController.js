app.controller('googleController', ['$scope', 'googleResults', '$http', 'uiGridConstants', '$q', '$location', '$timeout', '$interval', function ($scope, googleResults, $http, uiGridConstants, $q, $location, $timeout, $interval) {
  
    var gc = this;
   // gc.gridOptions.data = {};
   gc.displayList = [];

    //get data from json file (google api)
    googleResults
        .success(function(data){
            gc.dataList = data;
        });

    console.log('get result from request');

    var stop;
    gc.transfer = function() {
        if(angular.isDefined(stop)) return;

        stop = $interval(function() {
            if(gc.dataList.length > 0) {
                var popLead = gc.dataList.pop();
                console.log('pop item is ' + popLead);
                gc.displayList.push(popLead);
                gc.gridOptions.data = gc.displayList;
            } else {
                gc.stopScraping();
            }
        },3000);
    };

    gc.stopScraping = function() {
        if(angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    }

          // console.log(data);
             /*   for(var j=0; j<data.length; j++) {
                    console.log("data is " + data[j]);
                    display.push(data[j]);
                }
                    //display.push(data[0]);
                     gc.gridOptions.data = data;
                     var results;
                     for(var i=1;i<data.length;i++)
                     {
                        $timeout(function(){
                            console.log(i)},2000);
                     }
                    // timeout(display,data);// start recursive method
        
            //gc.gridOptions.data =data;
            // console.log(data);
        });*/
    /*     function timeout(display,data){
            console.log("shout"+data.length+' '+display.length);
                
            if(display.length==data.length)
                {
                    return "aa";
                }else
                {
                console.log('this is data1');
                 console.log(display);
                
                display= setTimeout(shout(data,display),2000);
                gc.gridOptions.data =display;
                if(display.length!=data.length)
                {
                    timeout(display,data);
                }
                }
                  /*function(a){
                    console.log('this is data1');
                 console.log(a);
                 results=bindData(display,data);
                 gc.gridOptions.data=results;
                }, 3000);

         }
         function shout(display,data)
         {
                 console.log("shout"+data.length+' '+display.length);
                 if(data.length-1!=display.length-1)
                    {
                        display.push(data[display.length-1]);
                    }
                 return display;
         }*/
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