/**
 * File: UsersCtrl;
 * Module: app:controllers;
 * Author: Giacomo Pinato;
 * Created: 10/05/14;
 * Version: 0.4;
 * Description: Controller for the user document view (admin only);
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.4 Fixed Angular auto sorting results
 * 0.3 Added sorting logic
 * 0.2 Added services support
 * 0.1 File creation
 ==============================================
 */

'use strict';

angular.module('maaperture').controller('UsersCtrl', function ($scope, $location, UserDataService, UserEditService, $routeParams) {

    $scope.current_document = $routeParams.user_id;
    $scope.original_data = [];
    $scope.original_keys = [];

    //Funzione per richiedere un documento al server.
    //Passa come parametri la collection e il documento da ricevere

    UserDataService.query({
        user_id: $routeParams.user_id }).$promise.then(
        function success(data) {
            $scope.labels = data.label;
            $scope.data = data.data;
            //inizializza un array con le chiavi originali e un array con i valori originali da modificare
            $.each($scope.data, function (key, value) {
                $scope.original_keys.push(key);
                $scope.original_data.push(value);
            });
        },
        function err() {
            $location.path("/404");

        }
    );

    //Funzione per cancellare il profilo utente attualmente visualizzato
    $scope.delete_document = function () {
        UserEditService.remove({
                user_id: $scope.current_document
            },

            function success() {
                $location.path('/users/');

            },
            function err() {
            }
        );
    };

});
