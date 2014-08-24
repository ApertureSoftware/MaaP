'use strict';

angular.module('maaperture').controller('DocumentEditCtrl', function ($scope, $location, DocumentEditService, $routeParams) {
    $scope.current_collection = $routeParams.col_id;
    $scope.current_document = $routeParams.doc_id;
    $scope.canEdit = true;
    $scope.original_data = {};

    //Funzione per richiedere un documento al server.
    //Passa come parametri la collection e il documento da ricevere
    DocumentEditService.query({
        col_id: $routeParams.col_id,
        doc_id: $routeParams.doc_id }).$promise.then(
        function success(data) {
            delete data.$promise;
            delete data.$resolved;
            $scope.original_data = JSON.stringify(data, undefined, 2); // indentation level = 2
        },
        function err(error) {
            $location.path("/404");

        }
    );

    //Funzione per inviare al server il nuovo documento modificato
    $scope.edit_document = function () {
        var validJson = true;
        try{
            var json_data = JSON.parse($scope.original_data);
        }catch(error){
            alert(error);
            validJson = false;
        }
        if(validJson === true) {
            DocumentEditService.update({
                    col_id: $scope.current_collection,
                    doc_id: $scope.current_document
                },
                json_data).$promise.then(
                function success() {
                    //In caso di successo ritorno al documento corrente
                    $location.path('/collection/' + $scope.current_collection + '/' + $scope.current_document);
                },
                function err() {
                    $location.path("/404");

                }
            );
        }
    };

    //Funzione per richiedere la cancellazione del documento visualizzato
    $scope.delete_document = function () {
        DocumentEditService.remove({
            col_id: $scope.current_collection,
            doc_id: $scope.current_document
        }).$promise.then(
            function success() {
                $location.path('/collection/' + $scope.current_collection);
            },
            function err() {
                alert("Qualcosa è andato storto..");
            }
        );
    };
});
