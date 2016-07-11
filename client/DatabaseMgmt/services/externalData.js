// get data from external 
app.factory('externalData', ['$http', function($http) { 
    var getExternalLeads = function() {
        return $http({
            method: 'GET',
            url: 'DatabaseMgmt/testFiles/externalData.json'
        });
    }

    var deleteExternalLeads = function(leadsToDelete) {
        return $http({
            method: 'PUT',
            url: '',
            data: leadsToDelete
        });
    }

    var editExternalLeads = function(leadsToEdit) {
        return $http({
            method: 'PATCH',
            url: '',
            data: leadsToEdit
        });
    }

    return {
        getExternalLeads: getExternalLeads,
        deleteExternalLeads: deleteExternalLeads,
        editExternalLeads: editExternalLeads
    }

}]);