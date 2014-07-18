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

describe('Controller: RegisterCtrl', function () {

    // load the controller's module
    beforeEach(module('maaperture', 'services', 'ngResource','ngCookies', 'ngRoute'));

    var MainCtrl,
        routeParams,
        $httpBackend,
        scope,
        location,
        cookieStore,
       credentials;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller,$location, $rootScope,_$httpBackend_,$cookieStore ) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_,
        location = $location,
        cookieStore = $cookieStore,
        credentials = {
                email: '1',
                pwd1: '1',
                pwd2: '1'
            };

        MainCtrl = $controller('RegisterCtrl', {
            $scope: scope,
            $routeParams:routeParams,
            $cookieStore:cookieStore
        });
    }));

    it('should register an user correclty', function () {
        // Given
        scope.signup_form={};
        scope.signup_form.$valid=true;
        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenPOST('http://localhost:9000/api/signup').respond(200);

        // When
        scope.signupForm();
        $httpBackend.flush();
        expect(location.path()).toBe('/');


    });

    it('should give an error when not succesfull', function () {
        // Given
        scope.signup_form={};
        scope.signup_form.$valid=false;
        $httpBackend.whenGET('http://localhost:9000/api/signup').respond(400);
        $httpBackend.whenGET('views/dashboard.html').respond(200);

        // When
        $httpBackend.flush();


    });


});

