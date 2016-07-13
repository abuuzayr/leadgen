app.factory('allUsersData', ['$http', function($http) {
    var getUserData = function() {
        return $http({
            method: 'GET',
            url: 'UserMgmt/testFiles/testData.json'
        });
    }

    var deleteUserData = function(usersToRemove) {
        return $http({
            method: 'PATCH',
            url: '',
            data: usersToRemove
        })
    }

    return {
        getUserData: getUserData,
        deleteUserData: deleteUserData
    }
}]);