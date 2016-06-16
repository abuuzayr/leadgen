app.factory('leadsResult', ['$http', function($http) { 
  return $http.get('ScrapingMgmt/testFiles/scrapLeads.json') 
    .success(function(data) { 
        return data; 
    }) 
    .error(function(err) { 
        return err; 
    });

    //test 2 json files
    /*var allLeads = {};
    allLeads.getYPLeads = function() {
        return $http.get('ScrapingMgmt/testFiles/scrapLeads.json') 
            .success(function(data) { 
                return data; 
            }) 
            .error(function(err) { 
                return err; 
            });
    }

    allLeads.getGoogleLeads = function() {
        return $http.get('ScrapingMgmt/testFiles/scrapGoogle.json') 
            .success(function(data) { 
                return data; 
            }) 
            .error(function(err) { 
                return err; 
            });
    }

    return allLeads;*/

    // create a new object
    /*var leadsFactory = {};

    //get leads data from yellow page
    leadsFactory.get = function(category,country) {
        return $http.get('/api/leads/' + category,country);
    };

    return leadsFactory;*/
}]);