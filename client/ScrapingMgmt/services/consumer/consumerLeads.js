app.factory('consumerLeads', ['$http', function($http) { 
  
    var getConsumerLeads = function(category) {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/api/consumer/scrape/yp/:' + category
        });
    }

    return {
        getConsumerLeads: getConsumerLeads
    } 
}]);