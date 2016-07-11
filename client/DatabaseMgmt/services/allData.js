app.factory('allData', ['$http', function($http) {  
    var getAllLeads = function() {
        return $http({
            method: 'GET',
            url: 'DatabaseMgmt/testFiles/testData.json'
        });
    }

    var deleteAllLeads = function(leadsToDelete) {
        return $http({
            method: 'PUT',
            url: '',
            data: leadsToDelete
        });
    }

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
    }
}]);