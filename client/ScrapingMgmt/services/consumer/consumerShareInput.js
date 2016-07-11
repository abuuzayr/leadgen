app.factory('consumerShareInput', function() {
    var categoryInput = "";

    var getCategory = function() {
        return categoryInput;
    }

    var setCategory = function(userCategory) {
        categoryInput = userCategory;
    }

    return {
        getCategory: getCategory,
        setCategory: setCategory
    }
});