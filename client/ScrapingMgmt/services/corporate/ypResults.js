app.factory('ypResults', ['$http', function($http) {
    var scrapeYellowPageLeads = function(category) {
        return $http({
            method: 'GET',
            url: 'http://10.4.1.145/api/corporate/scrape/yp/' + category
        });
    }

    return {
        scrapeYellowPageLeads: scrapeYellowPageLeads
    }
}]);