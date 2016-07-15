app.factory('historyData', ['$http', function($http) {
    var getHistory = function(fieldID) {
        return $http({
            method: 'GET',
            url: '//10.4.1.145/api/contacts/leadList/leads/' + fieldID
        })
    }
    return {
        getHistory: getHistory
    }
}]);