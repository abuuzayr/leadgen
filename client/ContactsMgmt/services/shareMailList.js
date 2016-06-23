app.factory('shareMailList',function() {
    var savedData = [];
    
    var setData = function(data) {
        savedData = data;
    }

    var getData = function() {
        //console.log(saveData);
        return savedData;
    }

    return {
        setData: setData,
        getData: getData,
    }
});