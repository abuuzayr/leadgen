app.factory('detailedMailListData', ['$http', function($http) {  
    var getMailListData = function(row) {
        return $http({
            method: 'POST',
            url: 'http://10.4.1.145/api/mailinglist/getSubscriber',
            data: row
        })
    }
    return {
        getMailListData: getMailListData
    }
}]);