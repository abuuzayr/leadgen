app.factory('allData', ['$http', 'appConfig', function($http, appConfig) {  
    var getAllLeads = function() {
        return $http({
            method: 'GET',
            url: appConfig.API_URL + '/dbmgmt/all'
        });
    };

    var deleteAllLeads = function(leadsToDelete) {
        return $http({
            method: 'PUT',
            url: appConfig.API_URL + '/dbmgmt/all',
            data: leadsToDelete
        });
    };

    // var editAllLeads = function(leadsToEdit) {
    //     return $http({
    //         method: 'PATCH',
    //         url: '',
    //         data: leadsToEdit
    //     });
    // }

    return {
        getAllLeads: getAllLeads,
        deleteAllLeads: deleteAllLeads,
        // editAllLeads: editAllLeads
    };
}]);