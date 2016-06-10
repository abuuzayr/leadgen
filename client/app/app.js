var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.router']);

	app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
	    $urlRouterProvider.otherwise('/');
 	    $stateProvider
	      .state('home', {
 	        url: '/',
	        views: {
                LeadList: {templateUrl: 'ContactsMgmt/partials/contactsLeadList.html', controller: 'contactsMainController'},
                BlackList: {templateUrl: 'ContactsMgmt/partials/contactsBlackList.html', controller: 'contactsMainController'}
            }
 	      })
 	}]);