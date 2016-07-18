app.factory('userService', ['$q', function($q) {
    var userType;
    var toShow = {
        showLead: "",
        showFinder: "",
        showAccount: "",
        showUser: "",
        showDatabase: "",
        showBar: ""
    };

    var setUserType = function(type) {
        userType = type;
    }

    var setUser = function() {
        var deferred = $q.defer();

        if (angular.isDefined(userType)) {
            deferred.resolve(userType);
        }

        return deferred.promise;
    }

    var getUserType = function() {
        var deferred = $q.defer();
        if (userType === 'user') {
            toShow.showLead = true;
            toShow.showFinder = true;
            toShow.showAccount = true;
            toShow.showUser = false;
            toShow.showDatabase = false;
            toShow.showBar = true;

        } else if (userType === 'admin') {
            toShow.showLead = true;
            toShow.showFinder = true;
            toShow.showAccount = true;
            toShow.showUser = true;
            toShow.showDatabase = false;
            toShow.showBar = true;

        } else if (userType === 'superadmin') {
            toShow.showLead = false;
            toShow.showFinder = false;
            toShow.showAccount = false;
            toShow.showUser = false;
            toShow.showDatabase = true;
            toShow.showBar = true;
        }
        console.log(userType);
        console.log(toShow.showLead);
        console.log(toShow.showDatabase);
        deferred.resolve(toShow);
        return deferred.promise;
    }


    var getShowLead = function() {
        return toShow.showLead;
    }

    var getShowFinder = function() {
        return toShow.showFinder;
    }

    var getShowAccount = function() {
        return toShow.showAccount;
    }

    var getShowUser = function() {
        return toShow.showUser;
    }

    var getShowDatabase = function() {
        return toShow.showDatabase;
    }

    var getShowBar = function() {
        return toShow.showBar;
    }

    var getType = function() {
        return userType;
    }

    var resetShow = function() {
        var deferred = $q.defer();
        toShow.showLead = false;
        toShow.showFinder = false;
        toShow.showAccount = false;
        toShow.showUser = false;
        toShow.showDatabase = false;

        deferred.resolve(toShow);
        return deferred.promise;
    }

    return {
        setUserType: setUserType,
        getUserType: getUserType,
        getShowLead: getShowLead,
        getShowFinder: getShowFinder,
        getShowAccount: getShowAccount,
        getShowUser: getShowUser,
        getShowDatabase: getShowDatabase,
        resetShow: resetShow,
        getShowBar: getShowBar,
        getType: getType
    }
}]);