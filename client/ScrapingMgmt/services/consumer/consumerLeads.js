app.factory('consumerLeads', ['$http', 'appConfig', function($http, appConfig) { 
  
    var getConsumerLeads = function(category) {
        return $http({
            method: 'GET',
            url: appConfig.API_URL + '/scrape/consumer/yp/' + category
        });
    }

    return {
        getConsumerLeads: getConsumerLeads
    } 
}]);