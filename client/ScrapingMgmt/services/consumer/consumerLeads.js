app.factory('consumerLeads', ['$http', 'appConfig', function($http, appConfig) { 
  
    var getConsumerLeads = function(category) {
        return $http({
            method: 'GET',
            url: appConfig.API_URL + '/consumer/scrape/yp/' + category
        });
    }

    return {
        getConsumerLeads: getConsumerLeads
    } 
}]);