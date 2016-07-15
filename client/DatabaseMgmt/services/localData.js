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

    //send object 
    var importToLocal = function(importData) {
        return $http({
            method: 'POST',
            url: '',
            data: importData
        });
    }

    var syncFromExternalLeads = function() {
        return $http({
            method: 'POST',
            url: '',
        });
    }

    return {
        getLocalLeads: getLocalLeads,
        deleteLocalLeads: deleteLocalLeads,
        editLocalLeads: editLocalLeads,
        importToLocal: importToLocal,
        syncFromExternalLeads: syncFromExternalLeads
    }

}]);