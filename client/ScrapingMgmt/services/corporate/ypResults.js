app.factory('ypResults', ['$http', 'appConfig', function($http, appConfig) {
    var scrapeYellowPageLeads = function(category) {
        return $http({
            method: 'GET',
            url: appConfig.API_URL + '/corporate/scrape/yp/' + category
        });
    }

    return {
        scrapeYellowPageLeads: scrapeYellowPageLeads
    }
}]);