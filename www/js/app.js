angular
    .module('app', [
        'ionic', 
        'ngCordova', 
        'ui.router',
        'autofocus'
    ])
    
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                    .state('app', {
                        url: "/app",
                        abstract: true,
                        templateUrl: "templates/menu.html",
                        controller: 'MenuCtrl'
                    })

                    .state('app.top3', {
                        url: "/top3",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/top3.html",
                                controller: 'Top3Ctrl'
                            }
                        }
                    })

                    .state('app.map', {
                        url: '/map',
                        views: {
                            'menuContent': {
                                templateUrl: "templates/map.html",
                                controller: 'MapCtrl'
                            }
                        }
                    })

                    .state('app.home', {
                        url: "/home",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/home.html",
                                controller: 'HomeCtrl'
                            }
                        }
                    })

                    .state('app.settings', {
                        url: "/settings",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/settings.html",
                                controller: 'SettingsCtrl'
                            }
                        }
                    })

                    .state('app.search', {
                        url: "/search",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/search.html",
                                controller: 'SettingsCtrl'
                            }
                        }
                    })

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/home');
        });
