app.factory('detailedMailListData', ['$http', 'appConfig', function($http, appConfig) {  
    var getMailListData = function(row) {
        return $http({
            method: 'POST',
            url: appConfig.API_URL + '/mailinglist/getSubscriber',
            data: row
        })
    }
    return {
        getMailListData: getMailListData
    }
}]);