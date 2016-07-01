app.controller('profileController', ['$scope', '$http', '$q', '$location', '$timeout', 'getDetails', function ($scope, $http, $q, $location, $timeout, getDetails) {
    
    var pc = this;
    //properties: email,new password, retypePassword

    getDetails.success(function(data) {
        pc.userName = data[0].name;
        pc.userEmail = data[0].email;
        pc.userPassword = data[0].password;
    });

    //post to database the updated details
    pc.submitDetails = function() {
        $http({ method: "POST", url: MYURL_URL, data: pc.user, cache: false });
    };
}]);

