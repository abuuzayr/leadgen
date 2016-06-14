var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.router'] );

	app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
	    $urlRouterProvider.otherwise('/');
 	    $stateProvider
	      .state('home', {
 	        url: '/',
			 templateUrl: 'views/pages/view.html'
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
           .state('business', {
               url: '/business',
			   templateUrl: 'ScrapingMgmt/partial/businessBeforeScrap.html'
           })

		   .state('business.businessStartScrap', {
			   url: '/startScrap',
			   templateUrl: 'ScrapingMgmt/partial/businessScrap.html'
		   })

           .state('consumer', {
           		url: '/consumer',
				templateUrl: 'ScrapingMgmt/partial/consumerBeforeScrap.html'
           })    
 	}]);