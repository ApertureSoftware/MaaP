/**
 * File: NavBarCtrl;
 * Module: app:controllers;
 * Author: Giacomo Pinato;
 * Created: 01/06/14;
 * Version: 0.1;
 * Description: Controller for the navigation bar;
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */

'use strict';

angular.module('maaperture').controller('NavBarCtrl', function ($scope, $cookieStore, $location, $route, LogoutService, CollectionListService) {
    $scope.isAdmin = $cookieStore.get("isAdmin");


    //Funzione per richiedere al server la lista di collection presenti.
    //Le collection saranno presenti nel menu a tendina
    CollectionListService.get({}).$promise.then(
        function success(data) {
            $scope.labels = data.labels;
            $scope.values = data.data;
        });

    //Funzione per effettuare il logout.
    //Rimuove i cookie di sessione e rimanda alla pagina di login.
    $scope.logout = function () {
        LogoutService.logout().$promise.then(
            function success() {
                $cookieStore.remove("loggedIn");
                $cookieStore.remove("isAdmin");
                $scope.isAdmin = false;
                $location.path('/login');
                $route.reload();
            },
            function error() {
                alert("I dunno why, but the logout failed :/");
                $location.path('/');
                $route.reload();
            });
    };


});
