app.factory('shareData',function() {
    var savedData = [];
    
    var setData = function(data) {
        savedData = data;
    }

    var getData = function() {
        //console.log(saveData);
        return savedData;
    }

    var addLead = function(newLead) {
        savedData.push(newLead);
        console.log('new lead is ' + newLead);
    }

    return {
        setData: setData,
        getData: getData,
        addLead: addLead
    }
});