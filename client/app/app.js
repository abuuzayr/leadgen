var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.router'] );

	app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
	    $urlRouterProvider.otherwise('/');
 	    $stateProvider
	      .state('home', {
 	        url: '/',
	        views: {
                viewA: {template: "Welcome to BulletLead"},
				viewB: {template: ""}
            }
 	      })
		   .state('leadlist', {
 	        url: '/leadlist',
		
	        views: {
				viewA: {templateUrl: 'ContactsMgmt/partials/contactsTabs.html'},
				viewB: {templateUrl: 'ContactsMgmt/partials/contactsLeadList.html', controller: 'contactsMainController'}
            }
 	      })
		   .state('blacklist', {
 	        url: '/blacklist',
		
	        views: {
				viewA: {templateUrl: 'ContactsMgmt/partials/contactsTabs.html'},
				viewB: {templateUrl: 'ContactsMgmt/partials/contactsBlackList.html', controller: 'contactsMainController'}
            }
 	      })
 	}]);