app.factory('companyProfile', ['$http', function($http) {  
    return $http.get('UserMgmt/testFiles/companyProfileData.json')
        .success(function(data) {
            return data;
        })
        .error(function(err) {
            return err;
        });

}]);