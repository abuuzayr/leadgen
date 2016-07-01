var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.router', 'ui.grid.selection','ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.resizeColumns'] );

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
		   .state('leadFinder', {
               url: '/lead-finder',
			   templateUrl: 'ScrapingMgmt/partial/leadsFinderMain.html',
			   controller: 'googleController'
           })
           .state('corporate', {
               url: '/corporate',
			   templateUrl: 'ScrapingMgmt/partial/corporateBeforeScrap.html',
           })

		   .state('corporate.corporateStartScrap', {
			   url: '/scraping',
			   templateUrl: 'ScrapingMgmt/partial/corporateScrap.html',
			   controller: 'googleController'
		   })

		   .state('corporateResults', {
			   url: '/corporate-results',
			   templateUrl: 'ScrapingMgmt/partial/corporateResults.html',
			   controller: 'resultController'
		   })

           .state('consumer', {
           		url: '/consumer',
				templateUrl: 'ScrapingMgmt/partial/consumerBeforeScrap.html'
           })

		   .state('consumer.consumerStartScrap', {
           		url: '/scraping',
				templateUrl: 'ScrapingMgmt/partial/consumerScrap.html'
           })

		   .state('consumerResults', {
			   url: '/consumer-results',
			   templateUrl: 'ScrapingMgmt/partial/consumerResults.html',
		   })

		   .state('profile', {
               url: '/profile',
			   templateUrl: 'ProfileMgmt/partial/profile.html',
			   controller: 'profileController'
           })

		   .state('userManagementprofile', {
               url: '/company-profile',
			   templateUrl: 'UserMgmt/partial/userMgmtProfile.html'
           })

		   .state('userManagementAdmin', {
			   url: '/adminmanagement',
			   templateUrl: 'UserMgmt/partial/userMgmtUsers.html'
		   })
 	}]);