/**
 * File: UsersCtrl_test;
 * Module: test;
 * Author: Mattia Sorgato;
 * Created: 10/05/14;
 * Version: 1.0.0;
 * Description: descrizione dettagliata del file;
 * Modification History: tabella dei cambiamenti effettuati sul file.
 */
'use strict';

describe('Controller: UsersCtrl', function () {


    var scope, routeParams, UsersCtrl,location;
    var $httpBackend;

    var data = { label: [ 'Email', 'Level' ],
        data: { email: 'bb@bb.com', level: 'administrator' } };

    beforeEach(module('maaperture', 'services', 'ngResource', 'ngRoute'));

    beforeEach(angular.mock.inject(function ($rootScope, $routeParams,$location, $controller, _$httpBackend_) {
        scope = $rootScope.$new();
        routeParams = $routeParams;
        $httpBackend = _$httpBackend_,
        location = $location;
        routeParams.user_id = 1;

        UsersCtrl = $controller('UsersCtrl', {
            '$scope': scope,
            '$routeParams': routeParams,
            'location': $location
        });
    }));

    it('should set some data on the scope when successful', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/users/' + routeParams.user_id).respond(200, data);

        $httpBackend.flush();
        expect(scope.data).toEqual(data.data);
        expect(scope.labels).toEqual(data.label);
        expect(scope.original_keys).toEqual(["email","level"]);
        expect(scope.original_data).toEqual(['bb@bb.com',"administrator"]);

    });

    it('should display an error when not successful', function () {
        $httpBackend.whenGET('http://localhost:9000/api/users/' + routeParams.user_id).respond(400);

        $httpBackend.flush();
        expect(location.path()).toBe('/404');

    });


    it('should delete a document correctly', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/users/1').respond(200,data);
        $httpBackend.whenDELETE('http://localhost:9000/api/users/1/edit').respond(200);

        // When
        scope.delete_document();
        $httpBackend.flush();
        expect(location.path()).toBe('/users/');


    });

    it('should display an error when the delete fails', function () {
        $httpBackend.whenGET('http://localhost:9000/api/users/1').respond(400);
        $httpBackend.whenDELETE('http://localhost:9000/api/users/1/edit').respond(400);

        scope.delete_document();
        $httpBackend.flush();


    });
});