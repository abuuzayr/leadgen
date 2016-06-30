//send results to backend
app.factory('sendResults',['$http', function($http) {
    
    var sendLeads = function(resultsToSend) {
        return $http({
            method: 'POST',
            url: '',
            data: resultsToSend
        });
    }

    return {
        sendLeads: sendLeads
    } 
}])