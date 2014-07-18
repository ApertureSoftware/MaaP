/**
 * File: LoginCtrl_test;
 * Module: modulo di appartenenza;
 * Author: Mattia Sorgato;
 * Created: 18/05/14;
 * Version: 1.0.0;
 * Description: descrizione dettagliata del file;
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 file creation
 ==============================================
 */


'use strict';

describe('Controller: LoginCtrl', function () {

    // load the controller's module
    beforeEach(module('maaperture', 'services', 'ngResource','ngCookies', 'ngRoute'));

    var MainCtrl,
        routeParams,
        $httpBackend,
        scope,
        cookieStore,
        location,
        data;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope,_$httpBackend_,$cookieStore,$location ) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        cookieStore = $cookieStore,
        location=$location,
        data ={};
        data.level=1;

        MainCtrl = $controller('LoginCtrl', {
            $scope: scope,
            $routeParams:routeParams,
            $cookieStore:cookieStore
        });
    }));


    it('should redirect if already logged in', function () {
        scope.loggedIn = true;
        $httpBackend.whenGET('views/dashboard.html').respond(200);

        $httpBackend.flush();
        expect(location.path()).toBe('/');


    });


    it('should set user data correctly when successful', function () {

        $httpBackend.whenGET('http://localhost:9000/api/login').respond(200, data);
        $httpBackend.whenGET('views/dashboard.html').respond(200);

        $httpBackend.flush();
        expect(location.path()).toBe('/');

    });



    it('should display an error when not successful ', function () {
        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenGET('http://localhost:9000/api/login').respond(400);

        $httpBackend.flush();
    });
});

