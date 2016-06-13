var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.router'] );

	app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
	    $urlRouterProvider.otherwise('/');
 	    $stateProvider
	      .state('home', {
 	        url: '/',
	        views: {
                viewA: {templateUrl: 'views/pages/view.html'},
				//viewB: {templateUrl: ""}
            }
 	      })
		   .state('leadlist', {
 	        url: '/leadlist',
		
	        views: {
				//viewA: {templateUrl: 'ContactsMgmt/partials/contactsTabs.html'},
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

           .state('business', {
               url: '/business',

               views: {
                   viewA: {templateUrl: 'ScrapingMgmt/partial/scrapTabs.html'},
                   viewB: {templateUrl: 'ScrapingMgmt/partial/beforeScrap.html'}
               }
           })
           
 	}]);