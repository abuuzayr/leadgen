app.factory('mailListData', ['$http', function($http) {  
    return $http.get('http://localhost:8080/api/contacts/mailingList')  .success(function(data) {    
        return data;    
    })    .error(function(err) {        
        return err;    
    });
}]);