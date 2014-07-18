/**
 * File: DocumentCtrl;
 * Module: app:controllers;
 * Author: Giacomo Pinato;
 * Created: 10/05/14;
 * Version: 0.2;
 * Description: Controller for the document view
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.2 Added services support
 * 0.1 File creation
 ==============================================
 */

'use strict';

angular.module('maaperture').controller('DocumentCtrl', function ($scope, $location, DocumentDataService, DocumentEditService, $routeParams, $cookieStore) {

    $scope.current_collection = $routeParams.col_id;
    $scope.current_document = $routeParams.doc_id;
    $scope.values = [];
    $scope.canEdit = $cookieStore.get("isAdmin");

    //Funzione per richiedere un documento al server.
    //Passa come parametri la collection e il documento da ricevere
    DocumentDataService.query({
        col_id: $routeParams.col_id,
        doc_id: $routeParams.doc_id }).$promise.then(
        function success(response) {
            $scope.data = response.data;
            $.each($scope.data, function (key, value) {
                //salva i valori in un array per non perdere l'ordinamento
                $scope.values.push(value);
            });
            //Salva le etichette in un array
            $scope.labels = response.label;
        },
        function error() {
            $location.path("/404");

        }

    );

    //Funzione per cancellare il documento attualmente visualizzato
    $scope.delete_document = function () {
        DocumentEditService.remove({
            col_id: $scope.current_collection,
            doc_id: $scope.current_document
        }).$promise.then(function success() {
                $location.path('/collection/' + $scope.current_collection);

            },
            function err() {
                alert("Qualcosa è andato storto..");
            }
        );
    };

});
