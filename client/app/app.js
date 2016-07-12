var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.router', 'ui.grid.selection', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.resizeColumns', 'ui.grid.importer', 'ngAnimate']);

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'LoginMgmt/loginPage.html',
            controller: 'LoginMgmt/loginController'
        })
        .state('home', {
            url: '/',
            templateUrl: 'homepage.html',
            controller: 'homepageController'
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
        .state('leadFinder', {
            url: '/lead-finder',
            templateUrl: 'ScrapingMgmt/partial/leadsFinderMain.html',
        })
        .state('corporate', {
            url: '/corporate',
            templateUrl: 'ScrapingMgmt/partial/corporateBeforeScrap.html',
            controller: 'beforeScrapeController'
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
        templateUrl: 'ScrapingMgmt/partial/consumerBeforeScrap.html',
        controller: 'beforeConsumerController'
    })

    .state('consumer.consumerStartScrap', {
        url: '/scraping',
        templateUrl: 'ScrapingMgmt/partial/consumerScrap.html',
        controller: 'consumerScrapController'
    })

    .state('consumerResults', {
        url: '/consumer-results',
        templateUrl: 'ScrapingMgmt/partial/consumerResults.html',
        controller: 'consumerResultController'
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