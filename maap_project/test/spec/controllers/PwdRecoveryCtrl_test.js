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

describe('Controller: PwdRecoveryCtrl', function () {

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
        location = $location;
        cookieStore = $cookieStore,
            credentials = {
                email: '1'
            };

        MainCtrl = $controller('PwdRecoveryCtrl', {
            $scope: scope,
            $routeParams:routeParams,
            $cookieStore:cookieStore
        });
    }));

    it('should recover the password correctly', function () {
        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenPOST('http://localhost:9000/api/forgot').respond(200);

        scope.recover();
        $httpBackend.flush();
        expect(location.path()).toBe('/');


    });

    it('should give an error when not succesfull', function () {
        // Given

        $httpBackend.whenPOST('http://localhost:9000/api/forgot').respond(400);
        $httpBackend.whenGET('views/dashboard.html').respond(200);
        $httpBackend.whenGET('views/pwdrecovery.html').respond(200);


        scope.recover();
        $httpBackend.flush();
        expect(location.path()).toBe('/recover');


    });


});

