'use strict';

angular.module('maaperture').controller('DocumentCtrl', function ($scope, $location, DocumentDataService, DocumentEditService, $routeParams, $cookieStore) {

    $scope.current_collection = $routeParams.col_id;
    $scope.current_document = $routeParams.doc_id;
    $scope.values = [];
    $scope.data={};
    $scope.isAdmin = $cookieStore.get("isAdmin");


    $scope.isObject = function (temp) {
        return typeof temp === 'object';
    }

    $scope.parseResponse = function (data, index) {
        var data_array=[];
        if (index > 0) {
            $.each(data, function (key, value) {

                if ($scope.isObject(value)) {
                     var innerObject = $scope.parseResponse(value,index-1);
                     data_array.push(innerObject);
                }
                else {
                     data_array.push(value);
                }
            });

            return data_array;
        }
        else{
            return JSON.stringify(data);
        }
    };
    //Funzione per richiedere un documento al server.
    //Passa come parametri la collection e il documento da ricevere

    DocumentDataService.query({
        col_id: $routeParams.col_id,
        doc_id: $routeParams.doc_id }).$promise.then(

        function success(response) {
            $scope.originalJson =  JSON.stringify(response.data,undefined, 2); // indentation level = 2
            $scope.values = $scope.parseResponse(response.data,1); //1 is the nesting limit, 2 not yet supported by server
            $scope.labels = response.label;
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

