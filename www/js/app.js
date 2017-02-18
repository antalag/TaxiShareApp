// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
app = angular.module('starter', ['ionic','ionic.cloud','ionic-material','trans', 'starter.services', 'ngCordova', 'btford.socket-io', 'constants.server', 'directive.g+signin']);

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

        .config(function ($stateProvider, $urlRouterProvider) {

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js
            $stateProvider

                    .state('login', {
                        url: '/login',
                        templateUrl: 'templates/login.html',
                        controller: 'loginCtrl'
                    })
                    // setup an abstract state for the tabs directive
                    .state('app', {
                        url: '/app',
                        controller: 'AppCtrl',
                        templateUrl: 'templates/menu.html'
                    })

                    // Each tab has its own nav history stack:

                    .state('app.dash', {
                        url: '/dash',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/dash.html',
                                controller: 'DashCtrl'
                            }
                        }
                    })

                    .state('app.users', {
                        url: '/users',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/users.html',
                                controller: 'UsersCtrl'
                            }
                        }
                    })
                    .state('app.users-detail', {
                        url: '/users/:userId',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/user-detail.html',
                                controller: 'UserDetailCtrl'
                            }
                        }
                    })

                    .state('app.account', {
                        url: '/account',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/account.html',
                                controller: 'AccountCtrl'
                            }
                        }
                    });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/dash');

        });
