app.factory('googleResults', ['$http', function($http) { 
    
    var firstTimeScrape = function(category,country) {
        return $http({
            method: 'GET',
            url: 'ScrapingMgmt/testFiles/scrapGoogle.json',
        });
    }

    var continueScrape = function() {
        return $http({
            method: 'GET',
            url: 'ScrapingMgmt/testFiles/scrapGoogle2.json'
        });
    }
    
    return {
        firstTimeScrape: firstTimeScrape,
        continueScrape: continueScrape
    }

    //api to use:  'http://localhost:8080/api/corporate/scrape/g/new' + "/" + country (for new only)
    // api to use: 'http://localhost:8080/api/corporate/scrape/g/cont'

    // when there is valid api, use this
    // // var firstTimeScrape = function(category,country) {
    //     return $http({
    //         method: 'GET',
    //         url: 'ScrapingMgmt/testFiles/scrapGoogle.json',
    //         params: {country: country, category: category}
    //     });
    // }

    // var continueScrape = function(category,country) {
    //     return $http({
    //         method: 'GET',
    //         url: 'ScrapingMgmt/testFiles/scrapGoogle2.json',
    //         params: {country: country, category: category}
    //     });
    // }



}]);