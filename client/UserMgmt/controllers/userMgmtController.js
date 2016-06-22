app.controller('userMgmtController', ['$scope', '$http', 'uiGridConstants', '$q', '$location', '$timeout', function ($scope, $http, uiGridConstants, $q, $location, $timeout) {
    var uc = this;

    uc.companyList = [
        { name: 'ABC'},
        { name: 'MailChimp'},
        { name: 'POKKA'}
    ];
}]);