app.factory('mailListData', ['$http', function($http) {  
    return $http.get('//10.4.145/api/contacts/mailingList')  .success(function(data) {    
        return data;    
    })    .error(function(err) {        
        return err;    
    });
}]);