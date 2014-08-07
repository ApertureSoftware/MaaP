'use strict';

angular.module('maaperture').controller('ProfileCtrl', function ($scope, $location, ProfileDataService, ProfileEditService) {

    $scope.original_data = [];
    $scope.original_keys = [];

    //Funzione per richiedere il proprio profilo al server.

    ProfileDataService.query({
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


    //Funzione per richiedere la cancellazione del proprio profilo
    $scope.delete_document = function () {
        ProfileEditService.remove({}).$promise.then(

            function success() {
                $location.path('/');
            },
            function err() {
                alert("Something went wrong,please try again later.");
            }
        );
    };
});
