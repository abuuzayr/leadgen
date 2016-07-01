app.factory('shareData',function() {
    var savedData = [];

    var getData = function() {
        //console.log(saveData);
        return savedData;
    }

    var addLead = function(newLead) {
        savedData.push(newLead);
        console.log('new lead is ' + newLead);
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