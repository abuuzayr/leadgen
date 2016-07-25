app.factory('companyProfile', ['$http', function($http) {  
    var getCompanyProfile = function() {
        return $http({
            method: 'GET',
            url: 'UserMgmt/testFiles/companyProfileData.json'
        });
    }

    return {
        getCompanyProfile: getCompanyProfile
    }

}]);
