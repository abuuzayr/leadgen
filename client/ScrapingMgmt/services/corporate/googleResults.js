app.factory('googleResults', ['$http', function($http) {

    var firstTimeScrape = function(category, country) {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/api/corporate/scrape/g/new/' + category + '/' + country
        });
    }

    var continueScrape = function(category, country) {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/api/corporate/scrape/g/cont/' + category + '/' + country
        });
    }

    return {
        firstTimeScrape: firstTimeScrape,
        continueScrape: continueScrape
    }
}]);