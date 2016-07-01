app.factory('consumerLeads', ['$http', function($http) { 
  
    var getConsumerLeads = function() {
        return $http({
            method: 'GET',
            url: 'ScrapingMgmt/testFiles/consumerLeads.json',
        });
    }

    var continueScrape = function() {
        return $http({
            method: 'GET',
            url: 'ScrapingMgmt/testFiles/scrapGoogle.json'
        });
    }

    return {
        getConsumerLeads: getConsumerLeads,
        continueScrape: continueScrape
    } 
}]);