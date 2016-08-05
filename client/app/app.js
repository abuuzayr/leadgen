var app = angular.module('app', ['ngMaterial', 'ngMessages', 'ngTouch', 'ui.grid', 'ui.router', 'ui.grid.selection', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.resizeColumns', 'ui.grid.importer', 'ngAnimate', 'ui.grid.exporter', 'ngCookies']);

app.config(['$urlRouterProvider', '$stateProvider', '$compileProvider', '$locationProvider', function($urlRouterProvider, $stateProvider, $compileProvider, $locationProvider) {
    // $locationProvider.html5Mode(true);
    $compileProvider.debugInfoEnabled(false);
    $urlRouterProvider.otherwise('/login');
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'LoginMgmt/loginPage.html',
            controller: 'loginCtrl',
            controllerAs: 'vm'
        })
        .state('home', {
            url: '/home',
            templateUrl: 'homepage.html',
            resolve: {
                security: ['$q', 'authServices', function($q, authServices) {
                    if (authServices.getToken()) {
                        return $q.resolve();
                    } else {
                        return $q.reject(false);
                    }
                }]
            }
        })
        .state('leadlist', {
            url: '/leadlist',
            templateUrl: 'ContactsMgmt/partials/contactsLeadList.html',
            controller: 'contactsMainController',
            resolve: {
                security: ['$q', 'authServices', function($q, authServices) {
                    if (authServices.getToken()) {
                        return $q.resolve();
                    } else {
                        return $q.reject(false);
                    }
                }]
            }
        })
        .state('blacklist', {
            url: '/blacklist',
            templateUrl: 'ContactsMgmt/partials/contactsBlackList.html',
            controller: 'blackListController',
            resolve: {
                security: ['$q', 'authServices', function($q, authServices) {
                    if (authServices.getToken()) {
                        return $q.resolve();
                    } else {
                        return $q.reject(false);
                    }
                }]
            }

        })
        .state('maillist', {
            url: '/maillist',
            templateUrl: 'ContactsMgmt/partials/contactsMailList.html',
            controller: 'mailListController',
            resolve: {
                security: ['$q', 'authServices', function($q, authServices) {
                    if (authServices.getToken()) {
                        return $q.resolve();
                    } else {
                        return $q.reject(false);
                    }
                }]
            }
        })
        .state('viewmaillist', {
            url: '/viewmaillist',
            templateUrl: 'ContactsMgmt/partials/viewMailList.html',
            controller: 'viewMailListController',
            resolve: {
                security: ['$q', 'authServices', function($q, authServices) {
                    if (authServices.getToken()) {
                        return $q.resolve();
                    } else {
                        return $q.reject(false);
                    }
                }]
            }
        })
        .state('leadFinder', {
            url: '/lead-finder',
            templateUrl: 'ScrapingMgmt/partial/leadsFinderMain.html',
            resolve: {
                security: ['$q', 'authServices', function($q, authServices) {
                    if (authServices.getToken()) {
                        if (authServices.getUserInfo().subType.consumer === true) {
                            $state.go('consumer');
                            return $q.resolve();
                        } else if (authServices.getUserInfo().subType.consumer === false) {
                            $state.go('corporate');
                            return $q.resolve();
                        }
                        // return $q.resolve();
                    } else {
                        return $q.reject(false);
                    }
                }]
            }
        })
        .state('corporate', {
            url: '/corporate',
            templateUrl: 'ScrapingMgmt/partial/corporateBeforeScrap.html',
            controller: 'beforeScrapeController',
            resolve: {
                security: ['$q', 'authServices', function($q, authServices) {
                    if (authServices.getToken()) {
                        return $q.resolve();
                    } else {
                        return $q.reject(false);
                    }
                }]
            }
        })

    .state('corporate.corporateStartScrap', {
        url: '/scraping',
        templateUrl: 'ScrapingMgmt/partial/corporateScrap.html',
        controller: 'googleController',
        resolve: {
            security: ['$q', 'authServices', function($q, authServices) {
                if (authServices.getToken()) {
                    return $q.resolve();
                } else {
                    return $q.reject(false);
                }
            }]
        }
    })

    .state('corporateResults', {
        url: '/corporate-results',
        templateUrl: 'ScrapingMgmt/partial/corporateResults.html',
        controller: 'resultController',
        resolve: {
            security: ['$q', 'authServices', function($q, authServices) {
                if (authServices.getToken()) {
                    return $q.resolve();
                } else {
                    return $q.reject(false);
                }
            }]
        }
    })

    .state('consumer', {
        url: '/consumer',
        templateUrl: 'ScrapingMgmt/partial/consumerBeforeScrap.html',
        controller: 'beforeConsumerController',
        resolve: {
            security: ['$q', 'authServices', function($q, authServices) {
                if (authServices.getToken()) {
                    return $q.resolve();
                } else {
                    return $q.reject(false);
                }
            }]
        }
    })

    .state('consumer.consumerStartScrap', {
        url: '/scraping',
        templateUrl: 'ScrapingMgmt/partial/consumerScrap.html',
        controller: 'consumerScrapController',
        resolve: {
            security: ['$q', 'authServices', function($q, authServices) {
                if (authServices.getToken()) {
                    return $q.resolve();
                } else {
                    return $q.reject(false);
                }
            }]
        }
    })

    .state('consumerResults', {
        url: '/consumer-results',
        templateUrl: 'ScrapingMgmt/partial/consumerResults.html',
        controller: 'consumerResultController',
        resolve: {
            security: ['$q', 'authServices', function($q, authServices) {
                if (authServices.getToken()) {
                    return $q.resolve();
                } else {
                    return $q.reject(false);
                }
            }]
        }
    })

    .state('profile', {
        url: '/profile',
        templateUrl: 'ProfileMgmt/partial/profile.html',
        controller: 'profileController',
        resolve: {
            security: ['$q', 'authServices', function($q, authServices) {
                if (authServices.getToken()) {
                    return $q.resolve();
                } else {
                    return $q.reject(false);
                }
            }]
        }
    })

    .state('userManagementprofile', {
        url: '/company-profile',
        templateUrl: 'UserMgmt/partial/userMgmtProfile.html',
        controller: 'userMgmtProfileController',
        resolve: {
            security: ['$q', 'authServices', function($q, authServices) {
                if (authServices.getToken()) {
                    return $q.resolve();
                } else {
                    return $q.reject(false);
                }
            }]
        }
    })

    .state('userManagementAdmin', {
        url: '/adminmanagement',
        templateUrl: 'UserMgmt/partial/userMgmtUsers.html',
        controller: 'userMgmtController',
        resolve: {
            security: ['$q', 'authServices', function($q, authServices) {
                if (authServices.getToken()) {
                    return $q.resolve();
                } else {
                    return $q.reject(false);
                }
            }]
        }
    })

    .state('externalDB', {
            url: '/externalDatabase',
            templateUrl: 'DatabaseMgmt/partial/externalDB.html',
            controller: 'externalDatabaseController',
            resolve: {
                security: ['$q', 'authServices', function($q, authServices) {
                    if (authServices.getToken()) {
                        return $q.resolve();
                    } else {
                        return $q.reject(false);
                    }
                }]
            }
        })
        .state('internalDB', {
            url: '/internalDB',
            templateUrl: 'DatabaseMgmt/partial/localDB.html',
            controller: 'localDatabaseController',
            resolve: {
                security: ['$q', 'authServices', function($q, authServices) {
                    if (authServices.getToken()) {
                        return $q.resolve();
                    } else {
                        return $q.reject(false);
                    }
                }]
            }
        })
        .state('allDatabase', {
            url: '/allDatabase',
            templateUrl: 'DatabaseMgmt/partial/allDatabase.html',
            controller: 'allDatabaseController',
            resolve: {
                security: ['$q', 'authServices', function($q, authServices) {
                    if (authServices.getToken()) {
                        return $q.resolve();
                    } else {
                        return $q.reject(false);
                    }
                }]
            }
        });
}]);