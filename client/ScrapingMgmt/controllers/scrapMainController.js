app.controller('scrapMainController',['$scope', function($scope){
    
    $scope.myData = [
        {
            'name': 'Lord Of the Rings',
            'email': 'lotr@email.com',
            'company': 'Gandalf',
            'number': '123'
        },
        {
            name: 'Pirates of the Caribbean',
            email: 'potc@pirate.com',
            company: 'Ahoy',
            number: '456'
        },
        {
            name: 'Zootopia',
            email: 'fox@animal.com',
            company: 'Animal Kingdom',
            number: '789'
        }
    ];
}]);