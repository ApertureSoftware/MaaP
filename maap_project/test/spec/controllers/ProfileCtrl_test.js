/**
 * File: ProfileCtrl_test;
 * Module: modulo di appartenenza;
 * Author: Mattia Sorgato;
 * Created: 16/05/14;
 * Version: 1.0.0;
 * Description: descrizione dettagliata del file;
 * Modification History: tabella dei cambiamenti effettuati sul file.
 */

'use strict';

describe('Controller: ProfileCtrl', function () {

    // load the controller's module
    beforeEach(module('maaperture', 'services', 'ngResource', 'ngRoute'));

    var MainCtrl,
        routeParams,
        $httpBackend,
        scope,
        location,
        data = { label: [ '_id', 'Timestamp', 'Message', 'Level', 'Hostname' ],
            data:
            { _id: '52b320a93401a40800000006',
                timestamp: 'today',
                message: 'AMAIL',
                level: 'info',
                hostname: 'b6d91509-de9d-4be9-819d-e04de3699ad2' } };
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller,$location, $rootScope,_$httpBackend_ ) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_,
            location = $location;

        routeParams ={};
        routeParams.col_id=0;
        routeParams.doc_id=0;

        MainCtrl = $controller('ProfileCtrl', {
            $scope: scope,
            $routeParams:routeParams
        });
    }));

    it('should set some data on the scope when successful', function () {
        $httpBackend.whenGET('http://localhost:9000/api/profile').respond(200, data);

        $httpBackend.flush();
        expect(scope.data).toEqual(data.data);
        expect(scope.labels).toEqual(data.label);


    });

    it('should display an error when not successful', function () {
        $httpBackend.whenGET('http://localhost:9000/api/profile').respond(400);

        $httpBackend.flush();
        expect(location.path()).toBe('/404');

    });

    it('should delete a document correctly', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/profile').respond(200,data);
        $httpBackend.whenDELETE('http://localhost:9000/api/profile/edit').respond(200);

        scope.delete_document();
        $httpBackend.flush();
        expect(location.path()).toBe('/');


    });

    it('should display an error when the delete fails', function () {
        $httpBackend.whenGET('http://localhost:9000/api/profile').respond(200,data);
        $httpBackend.whenDELETE('http://localhost:9000/api/profile/edit').respond(400);

        scope.delete_document();
        $httpBackend.flush();


    });


});
