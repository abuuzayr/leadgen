app.controller('profileController', ['$scope', '$http', '$q', '$location', '$timeout', function ($scope, $http, $q, $location, $timeout) {
    var pc = this;
    //properties: email,new password, retypePassword
    pc.user = {};

    //post to database the updated details
    pc.submitDetails = function() {
        $http({ method: "POST", url: MYURL_URL, data: pc.user, cache: false });
    };
}]);

