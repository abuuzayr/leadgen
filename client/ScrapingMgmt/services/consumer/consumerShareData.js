(function() {
    'use strict';
    app.factory('consumerShareData', function() {
        var savedData = [];

        var setData = function(data) {
            savedData = data;
        };

        var getData = function() {
            return savedData;
        };

        var addLead = function(newLead) {
            savedData.push(newLead);
            console.log('new lead is ' + newLead);
        };

        var clearData = function() {
            savedData = [];
        };

        return {
            setData: setData,
            getData: getData,
            addLead: addLead,
            clearData: clearData
        };
    });
})();