/**
 * File: PwdRecoveryCtrl;
 * Module: app:controllers;
 * Author: Giacomo Pinato;
 * Created: 10/05/14;
 * Version: 0.1;
 * Description: Controller for the password recovery page
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */

'use strict';

angular.module('maaperture').controller('PwdRecoveryCtrl', function ($scope, $route, $location, RecoveryService) {
    $scope.credentials = {
        email: ''

    };

    //Funzione per il recupero della password dimenticata.
    //Richiede al server di inviare la password di recupero allla email con cui si è registrati.
    $scope.recover = function () {
        RecoveryService.recover(
            {}, $scope.credentials).$promise.then(
            function success() {
                alert("If an account matched that address, an email will be sent with instructions.");
                $location.path('/');
                $route.reload();

            },
            function error() {
                alert("If an account matched that address, an email will be sent with instructions.");
                $location.path('/recover');
                $route.reload();
            });

    };

});

