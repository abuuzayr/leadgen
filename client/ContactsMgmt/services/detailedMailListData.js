app.factory('detailedMailListData', ['$http', function($http) { 
  var getMailListData = function(row) {
        return $http({
            method: 'POST',
            url: 'http://localhost:8080/api/mailinglist/getSubscriber',
            data: row
        })
    }
    return {
        getMailListData: getMailListData
    }
}]);