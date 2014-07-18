/**
 * File: ProfileEditCtrl;
 * Module: mapp:controllers;
 * Author: Giacomo Pinato;
 * Created: 12/05/14;
 * Version: 0.1;
 * Description: Controller for the profile edit;
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */

'use strict';

angular.module('maaperture').controller('ProfileEditCtrl', function ($scope, $location, ProfileEditService) {
    $scope.newPassword1 = null;
    $scope.newPassowrd2 = null;
    $scope.original_data = [];
    $scope.original_keys = [];
    $scope.admin = false;

    //Funzione per richiedere il proprio profilo al server.
    ProfileEditService.query({
    }).$promise.then(
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

    //Funzione per inviare al server dati aggiornati del proprio profilo
    $scope.edit_document = function () {
        var new_data = {};
        //Assembla il json da trasmettere.
        for (var i = 0; i < $scope.labels.length; i++) {
            new_data[$scope.original_keys[i]] = $scope.original_data[i];
        }
        //trasforma l'oggetto new_data in JSON.
        new_data.newpassword = $scope.newPassword1;
        var json_data = JSON.stringify(new_data);
        //Trasmette al server il nuovo json
        ProfileEditService.update({
            },
            json_data).$promise.then(
            function success() {
                $location.path('/profile');
            },
            function err() {
                alert("Something went wrong,please try again later.");
            }
        );


    };
    //Funzione per richiedere la cancellazione del profilo
    $scope.delete_document = function () {
        ProfileEditService.remove({

        }).$promise.then(

            function success() {
                $location.path('/');
            },
            function err() {
                alert("Something went wrong,please try again later.");

            }
        );
    };
});
