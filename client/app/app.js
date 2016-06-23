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
			 controller: 'blackListController'
		 })

		 .state('maillist', {
			 url: '/maillist',
			 templateUrl: 'ContactsMgmt/partials/contactsMailList.html',
			 controller: 'mailListController'
		 })
		 .state('viewmaillist', {
			 url: '/viewmaillist',
			 templateUrl: 'ContactsMgmt/partials/viewMailList.html',
			 controller: 'viewMailListController'
		 })
 	}]);
