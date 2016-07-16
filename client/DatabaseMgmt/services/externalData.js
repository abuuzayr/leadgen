// get data from external 
app.factory('externalData', ['$http', 'appConfig', function($http, appConfig) { 
    var getExternalLeads = function() {
        return $http({
            method: 'GET',
            url: appConfig.API_URL + '/dbmgmt/external/'
        });
    }

    var deleteExternalLeads = function(leadsToDelete) {
        return $http({
            method: 'PUT',
            url: appConfig.API_URL + '/dbmgmt/external/',
            data: leadsToDelete
        });
    }

    var editExternalLeads = function(leadsToEdit) {
        return $http({
            method: 'PATCH',
            url: appConfig.API_URL + '/dbmgmt/external',
            data: leadsToEdit
        });
    }

    var updateExternalLeads = function() {
        return $http({
            method: 'GET',
            url: appConfig.API_URL + '/dbmgmt/external/update'
        });
    }

    return {
        getExternalLeads: getExternalLeads,
        deleteExternalLeads: deleteExternalLeads,
        editExternalLeads: editExternalLeads,
        updateExternalLeads : updateExternalLeads
    }

}]);