/**
 * File: NavBarCtrl_test;
 * Module: modulo di appartenenza;
 * Author: Mattia Sorgato;
 * Created: 10/05/14;
 * Version: 1.0.0;
 * Description: descrizione dettagliata del file;
 * Modification History: tabella dei cambiamenti effettuati sul file.
 */
'use strict';

describe('Controller: NavBarCtrl', function () {

    // load the controller's module
    beforeEach(module('maaperture', 'services', 'ngResource', 'ngRoute'));

    var MainCtrl,
        routeParams,
        scope,
        location,
        $httpBackend;
    var data ={label: [ 'Timestamp', 'Message', 'Level' ],
                data:['a','b','c']};

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller,$location, $rootScope, _$httpBackend_) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        location = $location;

        MainCtrl = $controller('NavBarCtrl', {
            $scope: scope,
            $routeParams:routeParams
        });

    }));

    it('should get the collections from the server', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/collection/list').respond(200, data);
        $httpBackend.whenGET('views/dashboard.html').respond(200);

        $httpBackend.flush();

        expect(scope.labels).toEqual(data.labels);
        expect(scope.values).toEqual(data.data);

    });

    it('should do nothing if not authenticated', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/collection/list').respond(400);
        $httpBackend.whenGET('views/dashboard.html').respond(200);

        // When
        $httpBackend.flush();
        // Then


    });


    it('should log out correctly', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/logout').respond(200);
        $httpBackend.whenGET('http://localhost:9000/api/collection/list').respond(400);
        $httpBackend.whenGET('views/login.html').respond(200);
        $httpBackend.whenGET('views/dashboard.html').respond(200);


        scope.logout();
        $httpBackend.flush();

        expect(scope.isAdmin).toBe(false);
        expect(location.path()).toBe('/login');


    });

    it('should display an error when logout fails', function () {
        // Given
        $httpBackend.whenGET('http://localhost:9000/api/logout').respond(400);
        $httpBackend.whenGET('http://localhost:9000/api/collection/list').respond(400);
        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenGET('views/login.html').respond(200);

        // When
        scope.logout();
        $httpBackend.flush();
        expect(location.path()).toBe('/');

    });


});
