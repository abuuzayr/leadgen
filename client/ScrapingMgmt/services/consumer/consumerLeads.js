app.factory('consumerLeads', ['$http', function($http) { 
  
    var getConsumerLeads = function(category) {
        return $http({
            method: 'GET',
            url: 'http://10.4.1.145:8080/api/consumer/scrape/yp/:' + category
        });
    }

    return {
        getConsumerLeads: getConsumerLeads
    } 
}]);