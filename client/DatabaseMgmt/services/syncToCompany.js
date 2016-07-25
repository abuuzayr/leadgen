//send results to backend to sync to companies
app.factory('syncToCompany', ['$http', function($http) {

    var sendToCompany = function(resultsToSend) {
        return $http({
            method: 'POST',
            url: '',
            data: resultsToSend
        });
    };

    return {
        sendToCompany: sendToCompany
    };
}]);