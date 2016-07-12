app.controller('profileController', ['$scope', '$http', '$q', '$location', '$timeout', 'getDetails',
    function($scope, $http, $q, $location, $timeout, getDetails) {

        var pc = this;
        //properties: email,new password, retypePassword

        //get leads
        getDetails.getProfileDetails().then(function successCallback(res) {
                pc.userName = res.data[0].name;
                pc.userEmail = res.data[0].email;
                pc.userPassword = res.data[0].password;
            }),
            function errorCallback(err) {

            }

        var objToSend = {
            name: pc.userName,
            email: pc.userEmail,
            password: pc.userPassword
        };

        //post to database the updated details
        pc.submitDetails = function() {
            getDetails.updateProfileDetails(objToSend).then(function successCallback(res) {
                    pc.responseMessage = "Updated Profile!";
                }),
                function errorCallback(err) {
                    pc.responseMessage = "Error Occured";
                };
        };
    }
]);