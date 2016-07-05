app.factory('shareInput',function() {
    var countryInput = "";
    var categoryInput = "";

    var getCategory = function () {
        return categoryInput;
    }

    var getCountry = function () {
        return countryInput;
    }

    var setCategory = function(userCategory) {
        categoryInput = userCategory;
    }

    var setCountry = function(userCountry) {
        countryInput = userCountry;
    }

    return {
        getCategory: getCategory,
        getCountry: getCountry,
        setCategory: setCategory,
        setCountry: setCountry
    }
});