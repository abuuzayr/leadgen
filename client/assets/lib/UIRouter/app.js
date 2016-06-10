var app = angular.module('firstApp', []);

app.controller('mainController', function() {
    var vm = this;
    vm.message = "Avengers, ASSEMBLE!";
    vm.members = [
        {name: "Captain America", weapon: "Shield", skill: 8},
        {name: "Ironman", weapon: "Suit", skill: 8},
        {name: "Thor", weapon: "Mljonir", skill: 9},
        {name: "Hulk", weapon: "Fist", skill: 10}
    ];
});