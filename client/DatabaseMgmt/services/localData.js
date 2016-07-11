app.factory('localData', ['$http', function($http) {  
    var getLocalLeads = function() {
        return $http({
            method: 'GET',
            url: 'DatabaseMgmt/testFiles/localData.json'
        });
    }

    var deleteLocalLeads = function(leadsToDelete) {
        return $http({
            method: 'PUT',
            url: '',
            data: leadsToDelete
        })
    }

    var editLocalLeads = function(leadsToEdit) {
        return $http({
            method: 'PATCH',
            url: '',
            data: leadsToEdit
        });
    }

    //return array of object
    var importToLocal = function(importedData) {
        return $http({
            method: 'POST',
            url: '',
            data: importedData
        });
    }

    var syncFromExternal = function(updatedData) {
        return $http({
            method: 'POST',
            url: '',
            data: updatedData
        });
    }

    return {
        getLocalLeads: getLocalLeads,
        deleteLocalLeads: deleteLocalLeads,
        editLocalLeads: editLocalLeads,
        importToLocal: importToLocal,
        syncFromExternal: syncFromExternal
    }

}]);