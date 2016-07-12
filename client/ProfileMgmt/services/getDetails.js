app.factory('getDetails', ['$http', function($http) {
    var getProfileDetails = function() {
        return $http({
            method: 'GET',
            url: 'ProfileMgmt/testFiles/userDetails.json'
        });
    }

    var updateProfileDetails = function(newDetails) {
        return $http({
            method: 'PATCH',
            url: '',
            data: newDetails
        })
    }

    return {
        getProfileDetails: getProfileDetails,
        updateProfileDetails: updateProfileDetails
    }
}])