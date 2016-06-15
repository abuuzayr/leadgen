app.factory('leadsResult', ['$http', function($http) { 
  return $http.get('ScrapingMgmt/testFiles/scrapLeads.json') 
    .success(function(data) { 
        return data; 
    }) 
    .error(function(err) { 
        return err; 
    });

    // create a new object
    /*var leadsFactory = {};

    //get leads data from yellow page
    leadsFactory.get = function(category,country) {
        return $http.get('/api/leads/' + category,country);
    };

    return leadsFactory;*/
}]);