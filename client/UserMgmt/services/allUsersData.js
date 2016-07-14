app.factory('allUsersData', ['$http', function($http) {  
    var getUserData = function() {
        return $http({
            method: 'GET',
            url: 'UserMgmt/testFiles/testData.json'
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