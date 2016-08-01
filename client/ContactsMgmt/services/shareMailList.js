(function() {
    'use strict';
    app.factory('shareMailList', function() {
        var savedData = [];

        var setData = function(data) {
            savedData = data;
        };

        var getData = function() {
            return savedData;
        };

        return {
            setData: setData,
            getData: getData,
        };
    });
})();