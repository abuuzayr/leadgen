app.factory('localData', ['$http', 'appConfig', function($http, appConfig) {  
    var getLocalLeads = function() {
        return $http({
            method: 'GET',
            url: appConfig.API_URL + '/dbmgmt/local'
        });
    }

    var deleteLocalLeads = function(leadsToDelete) {
        return $http({
            method: 'PUT',
            url: appConfig.API_URL + '/dbmgmt/local',
            data: leadsToDelete
        })
    }

    var editLocalLeads = function(leadsToEdit) {
        return $http({
            method: 'PATCH',
            url: appConfig.API_URL + '/dbmgmt/local',
            data: leadsToEdit
        });
    }

    //send object 
    var importToLocal = function(importData) {
        return $http({
            method: 'POST',
            url: appConfig.API_URL + '/dbmgmt/local',
            data: importData
        });
    }

    var syncFromExternalLeads = function() {
        return $http({
            method: 'GET',
            url: appConfig.API_URL + '/dbmgmt/local/import',
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