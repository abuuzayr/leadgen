app.factory('allUsersData', ['$http', 'appConfig', function($http, appConfig) {  
    var getUserData = function(companyId) {
        return $http({
            method: 'GET',
            url: appConfig.UM_URL
        });
    }

    var deleteUserData = function(usersToRemove) {
        return $http({
            method: 'PUT',
            url: '',
            data: usersToRemove
        })
    }

    var editUserData = function(editedUser) {
        return $http({
            method: 'PATCH',
            url: '',
            data: editedUser
        })
    }

    return {
        getUserData: getUserData,
        deleteUserData: deleteUserData,
        editUserData: editUserData
    }
}]);