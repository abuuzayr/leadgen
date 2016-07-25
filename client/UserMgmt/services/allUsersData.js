app.factory('allUsersData', ['$http', 'appConfig', function($http, appConfig) {  
    var getUserData = function(companyId) {
        return $http({
            method: 'GET',
            url: appConfig.UM_URL + '/' + companyId
        });
    };

    var addUserData = function(newUserData) {
        return $http({
            method: 'POST',
            url: appConfig.UM_URL,
            data: newUserData
        });
    };

    var deleteUserData = function(userId) {
        return $http({
            method: 'DELETE',
            url: appConfig.UM_URL + '/' + userId,
        });
    };

    var editUserData = function(editedUser, userId) {
        return $http({
            method: 'PUT',
            url: appConfig.UM_URL + '/' + userId,
            data: editedUser
        });
    };

    return {
        getUserData: getUserData,
        deleteUserData: deleteUserData,
        editUserData: editUserData
    };
}]);