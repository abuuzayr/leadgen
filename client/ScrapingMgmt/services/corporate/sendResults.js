//send results to backend
app.factory('sendResults', ['$http', 'appConfig', function($http, appConfig) {

    var sendLeads = function(resultsToSend) {
        return $http({
            method: 'POST',
            url: appConfig.API_URL + '/scrape/',
            data: resultsToSend
        });
    }

    return {
        sendLeads: sendLeads
    }
}])