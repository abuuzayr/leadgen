app.factory('historyData', ['$http', 'appConfig', function($http, appConfig) {
    var getHistory = function(fieldID) {
        return $http({
            method: 'GET',
            url: appConfig.API_URL + '/contacts/leadList/leads/' + fieldID
        })
    }
    return {
        getHistory: getHistory
    }
}]);