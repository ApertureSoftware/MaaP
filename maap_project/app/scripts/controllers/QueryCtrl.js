/**
 * File: QueryCtrl;
 * Module: app:controllers;
 * Author: Giacomo Pinato;
 * Created: 10/05/14;
 * Version: 0.4;
 * Description: Controller for the query collection view
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

angular.module('maaperture').controller('QueryCtrl', function ($scope, $route, $location, QueryService, IndexService) {

    //Funzione di inizializzazione del controller
    var init = function () {
        $scope.current_page = 0;
        $scope.rows = [];
        $scope.getData();

    };

    //Funzione di recupero dei dati dal server.
    //In base ai parametri dello scope effettua una query sul server e recupera i dati
    //da visualizzare

    $scope.getData = function () {

        QueryService.query({
            page: $scope.current_page
        }).$promise.then(function success(response) {

                $scope.labels = response[0];
                $scope.data = response[1];
                $scope.pages = response[2].pages;

                //Salva i nomi originali delle colonne per le query a database
                $scope.column_original_name = Object.keys($scope.data[0].data);

                for (var i = 0; i < Object.keys($scope.data).length; i++) {
                    //Copia i valori da stampare in un array per mantenere l'ordine
                    //Ogni riga viene salvata in un array contenuto nell'oggetto rows.
                    $scope.rows[i] = [];
                    $.each($scope.data[i].data, function (key, value) {
                        $scope.rows[i].push(value);
                    });

                }
                //Nel caso di aggiornamento dei dati rimuovo quelli vecchi.
                $scope.rows.splice(i, $scope.rows.length);

            },
            function err() {
                $location.path("/404");
            }
        );
    };

    init();

    //Funzione per creare un indice a parire dall'id di una query
    $scope.createIndex = function (id) {
        var indexName = "jknoob";
        IndexService.insert({},
            {id: id, indexName: indexName}).$promise.then(
            function success() {
                alert("indice creato!");
                $location.path('/indexes');
                $route.reload();
            },
            function () {
                alert("Qualcosa è andato storto..");
            }
        );
    };

    //visualizza il comando per creare l'indice da shell
    $scope.showIndexInfo = function (indexData) {

        var queryID = indexData._id;
        var collectionName = indexData.data.name;
        var fields = indexData.data.fields;
        fields = fields.split(',');

        var info = 'You may create a new index from your mongoDB shell with this command:\n\n'
        var indexCMD = 'db.' + collectionName + '.ensureIndex( {';

        for (var i = 0; i < fields.length; i++) {
            if (i != 0) indexCMD += ',';
            indexCMD += fields[i] + ': 1';
        }

        indexCMD += ' } )';

        prompt(info, indexCMD);

    };


    //funzione per cancellare il documento di indice index
    $scope.delete_document = function (index) {
        QueryService.remove({
                index: index
            },

            function success() {
                $location.path('/queries/');
            },
            function err(error) {
            }
        );
    };

    //=====================================================================
    //Funzioni per paginazione avanzata
    $scope.range = function () {

        var rangeSize;
        if ($scope.pages < 9) {
            rangeSize = $scope.pages;
        }
        else {
            rangeSize = 9;
        }

        var ps = [];

        var start;

        if ($scope.current_page > 3) {
            start = $scope.current_page - 3;
        }
        else {
            start = $scope.current_page;
        }

        if (start > $scope.pages - rangeSize) {

            start = $scope.pages - rangeSize;

        }

        for (var i = start; i < start + rangeSize; i++) {

            ps.push(i);

        }

        return ps;

    };


    $scope.prevPage = function () {

        if ($scope.current_page > 0) {

            $scope.current_page--;
            $scope.getData();
        }

    };


    $scope.DisablePrevPage = function () {

        return $scope.current_page === 0 ? "disabled" : "";

    };


    $scope.nextPage = function () {

        if ($scope.current_page < $scope.pages - 1) {
            $scope.current_page++;
            $scope.getData();
        }

    };


    $scope.DisableNextPage = function () {

        return $scope.current_page === $scope.pages - 1 ? "disabled" : "";

    };

    //Va alla pagina $index
    $scope.toPage = function (index) {
        $scope.current_page = index;
        $scope.getData();
    };


});