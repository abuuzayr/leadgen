var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.router', 'ui.grid.selection','ui.grid.edit'] );

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
			   templateUrl: 'ScrapingMgmt/partial/businessBeforeScrap.html',
			   controller: 'googleController'
           })

		   .state('business.businessStartScrap', {
			   url: '/startScraping',
			   templateUrl: 'ScrapingMgmt/partial/businessScrap.html',
			   controller: 'googleController'
		   })

		   .state('businessResults', {
			   url: '/scrapResults',
			   templateUrl: 'ScrapingMgmt/partial/businessResults.html',
			   controller: 'resultController'
		   })

           .state('consumer', {
           		url: '/consumer',
				templateUrl: 'ScrapingMgmt/partial/consumerBeforeScrap.html'
           })

		   .state('consumer.consumerStartScrap', {
           		url: '/consumerStartScraping',
				templateUrl: 'ScrapingMgmt/partial/consumerScrap.html'
           })

		   .state('consumerResults', {
			   url: '/consumerScrapResults',
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