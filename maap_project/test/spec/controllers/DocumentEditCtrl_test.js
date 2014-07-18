/**
 * File: DocumentEditCtrl_test;
 * Module: modulo di appartenenza;
 * Author: Mattia Sorgato;
 * Created: 16/05/14;
 * Version: 1.0.0;
 * Description: descrizione dettagliata del file;
 * Modification History: tabella dei cambiamenti effettuati sul file.
 */

'use strict';

describe('Controller: DocumentEditCtrl', function () {

    // load the controller's module
    beforeEach(module('maaperture', 'services', 'ngResource', 'ngRoute'));

    var MainCtrl,
        routeParams,
        $httpBackend,
        scope,
        location,
        data = { _id: 'WM',
            name: 'Walter',
            surname: 'Mazzarri',
            email: 'walter@mazzarri.com',
            age: 45 };

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller,$location, $rootScope,_$httpBackend_ ) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_,
        location = $location;

        routeParams ={};
        routeParams.col_id=0;
        routeParams.doc_id=0;

        MainCtrl = $controller('DocumentEditCtrl', {
            $scope: scope,
            $routeParams:routeParams
        });
    }));

    it('should set some data on the scope when successful', function () {
        $httpBackend.whenGET('http://localhost:9000/api/collection/0/0/edit').respond(200, data);

        $httpBackend.flush();
        var temp = JSON.stringify(data, undefined, 2)

        expect(scope.original_data).toEqual(temp);


    });

    it('should display an error when not successful', function () {
        $httpBackend.whenGET('http://localhost:9000/api/collection/0/0/edit').respond(400);

        $httpBackend.flush();
        expect(location.path()).toBe('/404');

    });

    it('should edit a document correctly', function () {
        $httpBackend.whenGET('http://localhost:9000/api/collection/0/0/edit').respond(200,data);
        $httpBackend.whenPUT('http://localhost:9000/api/collection/0/0/edit').respond(200);

        scope.edit_document();
        $httpBackend.flush();
        expect(location.path()).toBe('/collection/0/0');


    });

    it('should display an error when the edit fails', function () {
        $httpBackend.whenGET('http://localhost:9000/api/collection/0/0/edit').respond(200,data);
        $httpBackend.whenPUT('http://localhost:9000/api/collection/0/0/edit').respond(400);

        scope.edit_document();
        $httpBackend.flush();
        expect(location.path()).toBe('/404');


    });

    it('should delete a document correctly', function () {
        $httpBackend.whenGET('http://localhost:9000/api/collection/0/0/edit').respond(200,data);
        $httpBackend.whenDELETE('http://localhost:9000/api/collection/0/0/edit').respond(200);

        scope.delete_document();
        $httpBackend.flush();
        expect(location.path()).toBe('/collection/0');


    });

    it('should display an error when the delete fails', function () {
        $httpBackend.whenGET('http://localhost:9000/api/collection/0/0/edit').respond(200,data);
        $httpBackend.whenDELETE('http://localhost:9000/api/collection/0/0/edit').respond(200);

        scope.delete_document();
        $httpBackend.flush();


    });
});
