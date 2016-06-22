app.factory('ypResults', ['$http', function($http) { 
    var scrapeYellowPageLeads = function() {
        return $http({
            method: 'GET',
            url: 'ScrapingMgmt/testFiles/scrapYP.json'
        });
    }

    return {
        scrapeYellowPageLeads: scrapeYellowPageLeads
    }

    // when there is valid api, use this
    // // var scrapeYellowPageLeads = function(category,country) {
    //     return $http({
    //         method: 'GET',
    //         url: 'ScrapingMgmt/testFiles/scrapGoogle.json',
    //         params: {country: country, category: category}
    //     });
    // }

    
}]);