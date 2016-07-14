app.controller('userMgmtProfileController', ['$scope', '$http', 'uiGridConstants', '$q', '$location', '$timeout', 'companyProfile', function($scope, $http, uiGridConstants, $q, $location, $timeout, companyProfile) {
    var uc = this;

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
        var path = '';
        var req = {
            method: 'GET',
            url: 'UserMgmt/testFiles/companyProfileData.json',
        }

        if ($window.sessionStorage.token) {
            req.headers.Authorization = $window.sessionStorage.token;
        }

        $http(req)
            .then(SuccessCallback)
            .catch(ErrorCallback);

        function SuccessCallback(res) {
            uc.type = res.data[0].type;
            uc.company = res.data[0].companyName;
            uc.email = res.data[0].email;
            uc.mailChimpAPI = res.data[0].mailChimpAPI;
            uc.googleAPI = res.data[0].googleAPI;
            uc.expiry = res.data[0].expiry;
            uc.storage = res.data[0].storage;
        }

        function ErrorCallback(err) {

        }
    }



    /* =========================================== Load animation =========================================== */
    var viewContentLoaded = $q.defer();

    $scope.$on('$viewContentLoaded', function() {
        $timeout(function() {
            viewContentLoaded.resolve();
        }, 0);
    });
    viewContentLoaded.promise.then(function() {
        $timeout(function() {
            uc.getCompanyDetails()
            componentHandler.upgradeDom();
        }, 0);
    });

}]);