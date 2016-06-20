app.factory('googleResults', ['$http', function($http) { 
    return $http.get('ScrapingMgmt/testFiles/scrapGoogle.json')
        .success(function(data) {
            return data;
        })
        .error(function(err) {
            return err;
        });


    // when there is valid api, use this
    // if this cannot pass the data, put this in google controller
    // return $http.get('ScrapingMgmt/testFiles/scrapGoogle.json',{params:{"category": gc.input.category, "country": gc.input.country}})
    //     .success(function(data) {
    //         return data;
    //     })
    //     .error(function(err) {
    //         return err;
    //     });

    // var getGoogleLeads = function(category,country) {
    //     return $http.get('ScrapingMgmt/testFiles/scrapGoogle.json')
    //         .success(function(data) {
    //             return data;
    //         })
    //         .error(function(err) {
    //             return err;
    //         });
    // }
}]);