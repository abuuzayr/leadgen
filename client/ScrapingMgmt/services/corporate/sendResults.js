//send results to backend
app.factory('sendResults', ['$http', function($http) {

    var sendLeads = function(resultsToSend) {
        return $http({
            method: 'POST',
            url: '//10.4.1.145/api/scrape/',
            data: resultsToSend
        });
    }

    return {
        sendLeads: sendLeads
    }
}])