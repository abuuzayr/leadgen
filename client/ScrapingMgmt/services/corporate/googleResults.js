app.factory('googleResults', ['$http', 'appConfig', function($http, appConfig) {

    var firstTimeScrape = function(category, country) {
        return $http({
            method: 'GET',
            url: appConfig.API_URL + '/corporate/scrape/g/new/' + category + '/' + country
        });
    }

    var continueScrape = function(category, country) {
        return $http({
            method: 'GET',
            url: appConfig.API_URL + '/corporate/scrape/g/cont/' + category + '/' + country
        });
    }

    return {
        firstTimeScrape: firstTimeScrape,
        continueScrape: continueScrape
    }
}]);