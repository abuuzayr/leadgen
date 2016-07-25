app.factory('allUsersData', ['$http', 'appConfig', function($http, appConfig) {  
    var getUserData = function(companyId) {
        return $http({
            method: 'GET',
            url: appConfig.API_URL + '/usermgmt'
        });
    };

    var addUserData = function(newUserData) {
        return $http({
            method: 'POST',
            url: appConfig.API_URL + '/usermgmt',
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
        addUserData: addUserData,
        deleteUserData: deleteUserData,
        editUserData: editUserData
    };
}]);
