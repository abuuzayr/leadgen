var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.router', 'ui.grid.edit', 'ngAnimate']);

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
	    $urlRouterProvider.otherwise('/');
 	    $stateProvider
	     
		 .state('home', {
			 url: '/',
			 templateUrl: "homepage.html"
		 })

		 .state('leadlist', {
			 url: '/leadlist',
			 templateUrl: 'ContactsMgmt/partials/contactsLeadList.html',
			 controller: 'contactsMainController'
		 })

		 .state('blacklist', {
			 url: '/blacklist',
			 templateUrl: 'ContactsMgmt/partials/contactsBlackList.html',
			 controller: 'contactsMainController'
		 })

		 .state('unsublist', {
			 url: '/unsublist',
			 templateUrl: 'ContactsMgmt/partials/contactsUnsubList.html',
			 controller: 'contactsMainController'
		 })

		 .state('maillist', {
			 url: '/maillist',
			 templateUrl: 'ContactsMgmt/partials/contactsMailList.html',
			 controller: 'mailListController'
		 })
 	}]);
