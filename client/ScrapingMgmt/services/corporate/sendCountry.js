app.factory('sendCountry', ['$http', function($http) {  
    return $http.get('ScrapingMgmt/testFiles/countryNames.json')
        .success(function(data) {
            return data;
        })
        .error(function(err) {
            return err;
        });
}]);