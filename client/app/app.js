var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.router', 'ui.grid.selection',] );

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
		   .state('profile', {
               url: '/profile',
			   templateUrl: 'ProfileMgmt/partial/profile.html',
			   controller: 'profileController'
           })
		   .state('userManagement', {
               url: '/management',
			   templateUrl: 'UserMgmt/partial/userMgmtMainView.html'
           })
		   .state('companyProfile', {
			   url: '/companyProfile',
			   templateUrl: 'UserMgmt/partial/userMgmtProfile.html'
		   })
		   .state('userManagementSA', {
			   url: '/SAmanagement',
			   templateUrl: 'UserMgmt/partial/userMgmtUsers.html'
		   })
 	}]);