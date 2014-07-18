/**
 * File: RegisterCtrl;
 * Module: app:controller;
 * Author: Giacomo Pinato;
 * Created: 18/05/14;
 * Version: 0.1;
 * Description: Controller for the registration page;
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */

'use strict';

angular.module('maaperture').controller('RegisterCtrl', function ($scope, $location, $route, $cookieStore, RegisterService) {
    $scope.credentials = {
        email: '',
        pwd1: '',
        pwd2: ''
    };

    //Funzione per inviare il form di registrazione al server.
    //Invia soltanto se il client ritiene che il form sia compilato con dati validi.
    $scope.signupForm = function () {
        if ($scope.signup_form.$valid) {
            RegisterService.register({},
                $scope.credentials).$promise.then(
                function success() {
                    $location.path('/');
                    $route.reload();
                },
                function err() {
                    alert("Registration failed! We already have this email in our databases ;)");
                }

            );
        }


    };

});

