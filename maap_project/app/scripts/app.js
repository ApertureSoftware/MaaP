'use strict';
/*
 * Moduli di angular da caricare per far girare il tutto
 */

angular.module('services', [ "ngResource"]);

angular
    .module('maaperture', [
        'ngCookies',
        'services',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ngRoute',
        'ui.sortable',
        'LocalStorageModule'
    ])
    .config(function ($routeProvider, $locationProvider, $provide, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardCtrl'
            })
            .when('/collection/:col_id', {
                templateUrl: 'views/collection.html',
                controller: 'CollectionCtrl'
            })
            .when('/collection/:col_id/:doc_id', {
                templateUrl: 'views/document.html',
                controller: 'DocumentCtrl'
            })
            .when('/collection/:col_id/:doc_id/edit', {
                templateUrl: 'views/documentEdit.html',
                controller: 'DocumentEditCtrl'
            })
            .when('/profile', {
                templateUrl: 'views/userProfile.html',
                controller: 'ProfileCtrl'
            })
            .when('/profile/edit', {
                templateUrl: 'views/userEdit.html',
                controller: 'ProfileEditCtrl'
            })
            .when('/users', {
                templateUrl: 'views/userCollection.html',
                controller: 'UsersCollectionCtrl'
            })
            .when('/users/:user_id', {
                templateUrl: 'views/userDocument.html',
                controller: 'UsersCtrl'
            })
            .when('/users/:user_id/edit', {
                templateUrl: 'views/userEdit.html',
                controller: 'UsersEditCtrl'
            })
            .when('/queries', {
                templateUrl: 'views/queryCollection.html',
                controller: 'QueryCtrl'
            })
            .when('/indexes', {
                templateUrl: 'views/indexCollection.html',
                controller: 'IndexCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/logout', {
                templateUrl: 'views/logout.html',
                controller: 'DocumentEditCtrl'
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'RegisterCtrl'
            })
            .when('/recover', {
                templateUrl: 'views/pwdrecovery.html',
                controller: 'PwdRecoveryCtrl'
            })
            .when('/404', {
                templateUrl: 'views/404.html'
            })
            .when('/help', {
                templateUrl: 'views/help.html'
            })


            .otherwise({
                redirectTo: '/404'
            });


        $locationProvider.html5Mode(true);

        //Intercetto ogni risposta dal server e verifico che l'utente sia autenticato prima di visualizzare qualsiasi
        //informazione.

        $httpProvider.responseInterceptors.push(function ($q, $location, $cookieStore) {
            return function (promise) {
                return promise.then(
                    // Success: just return the response
                    function (response) {
                        return response;
                    },
                    // Error: check the error status to get only the 401
                    function (response) {
                        if (response.status === 401)
						{
							$cookieStore.remove("loggedIn");
							$cookieStore.remove("isAdmin");
                            $location.url('/login');
						}
						return $q.reject(response);
                    }
                );
            }
        });
    });



