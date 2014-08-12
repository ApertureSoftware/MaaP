'use strict';

angular.module('maaperture').controller('DocumentCtrl', function ($scope, $location, DocumentDataService, DocumentEditService, $routeParams, $cookieStore) {

    $scope.current_collection = $routeParams.col_id;
    $scope.current_document = $routeParams.doc_id;
    $scope.values = [];
    $scope.data={};
    $scope.canEdit = $cookieStore.get("isAdmin");
    $scope.tempData =  { name: "Giacomo",
        surname: "Pinato",
        email: "giacomo.pinato@gmail.com",
        age: 23,
        interest: {primario:"Musica",secondario:"Gnocca"},
        bitches: { bitches1: "Julia", bitches2: "Eva", bitches3: "Scarlett" } };

    $scope.isObject = function (temp) {
        return typeof temp === 'object';
    }

    $scope.parseResponse = function (data, index) {
        var values=[];
        if (index > 1) {
            $.each(data, function (key, value) {

                if ($scope.isObject(value)) {
                     var innerObject = $scope.parseResponse(value,index-1);
                     values.push(innerObject);
                }
                //salva i valori in un array per non perdere l'ordinamento

                else {
                     values.push(value);
                }
            });

            return values;
        }
        else{
            return values;
        }
    };
    //Funzione per richiedere un documento al server.
    //Passa come parametri la collection e il documento da ricevere

    DocumentDataService.query({
        col_id: $routeParams.col_id,
        doc_id: $routeParams.doc_id }).$promise.then(

        function success(response) {
            $scope.originalJson =  JSON.stringify(response.data,undefined, 2); // indentation level = 2
            $scope.data = $scope.tempData;

            $scope.values = $scope.parseResponse($scope.data,3);
            //Salva le etichette in un array
            //$scope.labels = response.label;
            $scope.labels = ["nome","cognome","email","eta",["interessi","uno: ","due: "],["bitches","Mora: ","Bionda: ","Rossa: "]];


        },

        function error() {
            $location.path("/" + $scope.current_collection);
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
                alert("Something went wrong, document could not be deleted");
            }
        );
    };


});

