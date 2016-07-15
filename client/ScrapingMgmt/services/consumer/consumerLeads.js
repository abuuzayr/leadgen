app.factory('consumerLeads', ['$http', function($http) { 
  
    var getConsumerLeads = function(category) {
        return $http({
            method: 'GET',
            url: '//10.4.145/api/consumer/scrape/yp/:' + category
        });
    }

    return {
        getConsumerLeads: getConsumerLeads
    } 
}]);