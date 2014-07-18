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

describe('Controller: UsersEditCtrl', function () {

    // load the controller's module
    beforeEach(module('maaperture', 'services', 'ngResource', 'ngRoute'));

    var MainCtrl,
        routeParams,
        $httpBackend,
        scope,
        location,
        data = { label: [ 'Email', 'Level' ],
            data: { email: 'bb@bb.com', level: 'administrator' } };
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller,$location, $rootScope,_$httpBackend_ ) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_,
        location = $location;

        routeParams ={};
        routeParams.col_id=0;
        routeParams.doc_id=0;

        MainCtrl = $controller('UsersEditCtrl', {
            $scope: scope,
            $routeParams:routeParams
        });
    }));

    it('should set some data on the scope when successful', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/users/edit').respond(200, data);

        $httpBackend.flush();
        expect(scope.data).toEqual(data.data);
        expect(scope.labels).toEqual(data.label);
        expect(scope.original_keys).toEqual(["email","level"]);
        expect(scope.original_data).toEqual(['bb@bb.com',"administrator"]);

    });

    it('should display an error when not successful', function () {
        $httpBackend.whenGET('http://localhost:9000/api/users/edit').respond(400);

        $httpBackend.flush();
        expect(location.path()).toBe('/404');

    });

    it('should delete a document correctly', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/users/edit').respond(200,data);
        $httpBackend.whenDELETE('http://localhost:9000/api/users/edit').respond(200);

        // When
        scope.delete_document();
        $httpBackend.flush();
        expect(location.path()).toBe('/users/');

    });

    it('should display an error when the delete fails', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/users/edit').respond(200,data);
        $httpBackend.whenDELETE('http://localhost:9000/api/users/edit').respond(400);

        scope.delete_document();
        $httpBackend.flush();


    });

});
