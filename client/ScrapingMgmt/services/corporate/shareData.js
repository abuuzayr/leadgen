app.factory('shareData', function() {
    var savedData = [];

    var getData = function() {
        return savedData;
    }

    var addLead = function(newLead) {
        savedData.push(newLead);
    }

    var clearData = function() {
        savedData = [];
    }

    return {
        getData: getData,
        addLead: addLead,
        clearData: clearData
    }
});