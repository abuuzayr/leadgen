app.controller('profileController', ['$scope', '$http', '$q', '$location', '$timeout', 'getDetails', 'appConfig', '$window', 'feedbackServices', '$cookies', 'authServices',
    function($scope, $http, $q, $location, $timeout, getDetails, appConfig, $window, feedbackServices, $cookies, authServices) {

        var pc = this;
        pc.profileData = {};
        pc.pwd = {};
        pc.newPwd = '';
        pc.retypePwd = '';
        //properties: email,new password, retypePassword

        //get profile details
        // getDetails.getProfileDetails().then(function successCallback(res) {
        //         pc.userName = res.data[0].name;
        //         pc.userEmail = res.data[0].email;
        //         pc.userPassword = res.data[0].password;
        //     }),
        //     function errorCallback(err) {

        //     };

        //get profile from cookie
        pc.userName = '';
        pc.userEmail = '';


        if (authServices.getToken()) {
            pc.userName = authServices.getToken().username;
            pc.userEmail = authServices.getToken().email;

            console.log(pc.userName);
            console.log(pc.userEmail);
        }

        // pc.getFromDatabase = function() {
        //     var path = '/protected/settings';
        //     var req = {
        //         method: 'GET',
        //         url: appConfig.API_URL + path,
        //         headers: {}
        //     };
        //     if ($window.sessionStorage.token) {
        //         req.headers.Authorization = $window.sessionStorage.token;
        //     }

        //     $http(req)
        //         .then(SuccessCallback);
        //     // .catch(ErrorCallback);

        //     function SuccessCallback(res) {
        //         pc.profileData = res.data.adminData;
        //     }

        // function ErrorCallback(err) {
        //     return feedbackServices.hideFeedback('#profileFeedback')
        //         .then(feedbackServices.errorFeedback('Unable to get data', '#profileFeedback'));
        // }
        // };

        // if need to change email and username
        // pc.updateDatabase = function() {
        //     var path = '/protected/settings';
        //     var req = {
        //         method: 'PUT',
        //         url: appConstant.API_URL + path,
        //         headers: {},
        //         data: {
        //             adminData: pc.profileData
        //         }
        //     }
        //     if ($window.sessionStorage.token) {
        //         req.headers.Authorization = $window.sessionStorage.token;
        //     }

        //     $http(req)
        //         .then(SuccessCallback)
        //         .catch(ErrorCallback);

        //     function SuccessCallback(res) {
        //         return feedbackServices.hideFeedback('#profileFeedback').
        //         then(feedbackServices.successFeedback('User profile updated', '#profileFeedback', 2000));
        //     }

        //     function ErrorCallback(err) {
        //         return feedbackServices.hideFeedback('#profileFeedback').
        //         then(feedbackServices.errorFeedback(err.data, '#profileFeedback'));
        //     }
        // }

        // pc.changePassword = function() {
        //     var path = '/protected/settings/password';
        //     var req = {
        //         method: 'PUT',
        //         url: appConstant.API_URL + path,
        //         headers: {},
        //         data: {
        //             pwd: pc.pwd
        //         }
        //     };
        //     if ($window.sessionStorage.token) {
        //         req.headers.Authorization = $window.sessionStorage.token;
        //     }
        //     return $http(req)
        //         .then(SuccessCallback)
        //         .catch(ErrorCallback);

        //     function SuccessCallback(res) {
        //         return feedbackServices.successFeedback('Password updated', '#profileFeedback', 2000)
        //             .then(delayLogout(1000));
        //     }

        //     function ErrorCallback(err) {
        //         return feedbackServices.hideFeedback('#profileFeedback').
        //         then(feedbackServices.errorFeedback('Unable to change password', '#profileFeedback'));
        //     }
        // };

        //validate password and change accordingly
        pc.validateNewPassword = function() {
            if (pc.newPwd === pc.retypePwd) {
                // pc.userPassword = pc.newPwd;
                pc.pwd.newPwd = pc.newPwd;
                return pc.changePassword();
            }
            return feedbackServices.hideFeedback('#profileFeedback').
            then(feedbackServices.errorFeedback('New password inputs do not match', '#profileFeedback'));
        };

        // var objToSend = {
        //     name: pc.userName,
        //     email: pc.userEmail,
        //     password: pc.userPassword
        // };

        //post to database the updated details
        // pc.submitDetails = function() {
        //     getDetails.updateProfileDetails(objToSend).then(function successCallback(res) {
        //             pc.responseMessage = "Updated Profile!";
        //         }),
        //         function errorCallback(err) {
        //             pc.responseMessage = "Error Occured";
        //         };
        // };

        /* =========================================== Load animation =========================================== */
        var viewContentLoaded = $q.defer();

        $scope.$on('$viewContentLoaded', function() {
            $timeout(function() {
                viewContentLoaded.resolve();
            }, 0);
        });
        viewContentLoaded.promise.then(function() {
            $timeout(function() {
                // pc.getFromDatabase();
                componentHandler.upgradeDom();
            }, 0);
        });
    }
]);