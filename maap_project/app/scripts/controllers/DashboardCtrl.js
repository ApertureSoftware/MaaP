/**
 * File: DashboardCtrl;
 * Module: app:controllers;
 * Author: Giacomo Pinato;
 * Created: 01/06/14;
 * Version:  0.1;
 * Description: Controller for the dashboard;
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */

'use strict';

angular.module('maaperture').controller('DashboardCtrl', function ($scope, CollectionListService) {
    $scope.searchbox = '';
    // Servizio per ricevere la lista di collection dal server.
    $scope.Search = function () {
        CollectionListService.get({find: $scope.searchbox}).$promise.then(function success(data) {
            $scope.labels = data.labels;
            $scope.values = data.data;
        });
    };

    $scope.Search();
});
