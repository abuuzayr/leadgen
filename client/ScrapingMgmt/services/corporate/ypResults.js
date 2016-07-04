app.factory('ypResults', ['$http', function($http) { 
    var scrapeYellowPageLeads = function(category) {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/api/corporate/scrape/yp/:' + category
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