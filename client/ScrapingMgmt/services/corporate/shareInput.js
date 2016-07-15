app.factory('shareInput', function() {
    var countryInput = "";
    var categoryInput = "";
    var toStart = false;

    var getCategory = function() {
        return categoryInput;
    }

    var getCountry = function() {
        return countryInput;
    }

    var setCategory = function(userCategory) {
        categoryInput = userCategory;
    }

    var setCountry = function(userCountry) {
        countryInput = userCountry;
    }

    var changeStart = function() {
        toStart = true;
    }

    var getStart = function() {
        return toStart;
    }

    return {
        getCategory: getCategory,
        getCountry: getCountry,
        setCategory: setCategory,
        setCountry: setCountry,
        changeStart: changeStart,
        getStart: getStart
    }
});