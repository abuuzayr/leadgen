app.controller('userMgmtProfileController', ['$scope', '$http', 'uiGridConstants', '$q', '$location', '$timeout', 'companyProfile', 'feedbackServices', 'appConfig',
    function($scope, $http, uiGridConstants, $q, $location, $timeout, companyProfile, feedbackServices, appConfig) {

        var uc = this;
        uc.companyData = {};

        // up.moreDetails = false;

        // uc.getData = function() {
        //     companyProfile.success(function(data) {
        //         console.log('data is ' + data[0].name);
        //         uc.type = data[0].type;
        //         uc.company = data[0].companyName;
        //         uc.email = data[0].email;
        //         uc.mailChimpAPI = data[0].mailChimpAPI;
        //         uc.googleAPI = data[0].googleAPI;
        //         uc.expiry = data[0].expiry;
        //         uc.storage = data[0].storage;
        //     });
        // }

        //get data from json file
        companyProfile.getCompanyProfile().then(function successCallback(res) {
                uc.type = res.data[0].type;
                uc.company = res.data[0].companyName;
                uc.email = res.data[0].email;
                uc.mailChimpAPI = res.data[0].mailChimpAPI;
                uc.googleAPI = res.data[0].googleAPI;
                uc.expiry = res.data[0].expiry;
                uc.storage = res.data[0].storage;

            }),
            function errorCallback(err) {
                console.log('err is ' + err);
            };

        uc.getCompanyDetails = function() {
            var path = 'protected/settings';
            var req = {
                method: 'GET',
                url: appConfig.API_URL + path,
                headers: {}
            };

            if ($window.sessionStorage.token) {
                req.headers.Authorization = $window.sessionStorage.token;
            }

            $http(req)
                .then(SuccessCallback)
                .catch(ErrorCallback);

            function SuccessCallback(res) {
                uc.companyData = res.data;
            }

            function ErrorCallback(err) {
                return feedbackServices.hideFeedback('#userFeedback')
                    .then(feedbackServices.errorFeedback('Unable to get data', '#userFeedback'));
            }
        };

        /* =========================================== Load animation =========================================== */
        var viewContentLoaded = $q.defer();

        $scope.$on('$viewContentLoaded', function() {
            $timeout(function() {
                viewContentLoaded.resolve();
            }, 0);
        });
        viewContentLoaded.promise.then(function() {
            $timeout(function() {
                uc.getCompanyDetails();
                componentHandler.upgradeDom();
            }, 0);
        });
    }
]);