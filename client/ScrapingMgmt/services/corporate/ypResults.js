app.factory('ypResults', ['$http', function($http) {
    var scrapeYellowPageLeads = function(category) {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/api/corporate/scrape/yp/' + category
        });
    }

    return {
        scrapeYellowPageLeads: scrapeYellowPageLeads
    }
}]);