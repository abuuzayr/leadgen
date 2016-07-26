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
            method: 'PUT',
            url: appConfig.API_URL + '/usermgmt/' + userId,
        });
    };

    var editUserData = function(editedUser, userId) {
        return $http({
            method: 'PATCH',
            url: appConfig.API_URL + '/usermgmt/' + userId,
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
