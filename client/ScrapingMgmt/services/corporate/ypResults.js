app.factory('ypResults', ['$http', 'appConfig', function($http, appConfig) {
    var scrapeYellowPageLeads = function(category) {
        return $http({
            method: 'GET',
            url: appConfig.API_URL + '/scrape/corporate/yp/' + category
        });
    }

    return {
        scrapeYellowPageLeads: scrapeYellowPageLeads
    }
}]);