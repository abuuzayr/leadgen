//send results to backend
app.factory('sendResults', ['$http', function($http) {

    var sendLeads = function(resultsToSend) {
        return $http({
            method: 'POST',
            url: 'http://localhost:8080/api/scrape/',
            data: resultsToSend
        });
    }

    return {
        sendLeads: sendLeads
    }
}])