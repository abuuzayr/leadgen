app.controller('userMgmtProfileController', ['$scope', '$http', 'uiGridConstants', '$q', '$location', '$timeout', 'companyProfile', function ($scope, $http, uiGridConstants, $q, $location, $timeout, companyProfile) {
    var uc = this;

    // up.moreDetails = false;
    
    companyProfile.success(function(data) {
        console.log('data is ' + data[0].name);
        uc.type = data[0].type;
        uc.company = data[0].companyName;
        uc.email = data[0].email;
        uc.mailChimpAPI = data[0].mailChimpAPI;
        uc.googleAPI = data[0].googleAPI;
        uc.expiry = data[0].expiry;
        uc.storage = data[0].storage;
    });
    
}]);