app.factory('leadsResult', ['$http', function($http) { 
  return $http.get('ScrapingMgmt/testFiles/scrapLeads.json') 
    .success(function(data) { 
        return data; 
    }) 
    .error(function(err) { 
        return err; 
    }); 
}]);