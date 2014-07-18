/**
 * File: ControllerColl;
 * Module: modulo di appartenenza;
 * Author: Mattia Sorgato;
 * Created: 10/05/14;
 * Version: 1.0.0;
 * Description: descrizione dettagliata del file;
 * Modification History: tabella dei cambiamenti effettuati sul file.
 */
'use strict';

describe('DashboardCtrl', function () {
    var DashboardCtrl,
        $httpBackend,
        scope,
        data = {labels:['a','b','c'],
            data: [1,2,3]};

    beforeEach(module('maaperture', 'services', 'ngResource', 'ngRoute'));

    beforeEach(function () {
        angular.mock.inject(function ($injector, $controller,_$httpBackend_, $rootScope) {
            $httpBackend = _$httpBackend_;
            scope = $rootScope.$new();

            DashboardCtrl = $controller('DashboardCtrl', {
                '$scope': scope
            });
        })
    });

    describe('get the right list', function () {
        it('should call getUser with username', inject(function () {

            $httpBackend.whenGET('http://localhost:9000/api/collection/list').respond(200, data);

            $httpBackend.flush();

            expect(scope.labels).toEqual(data.labels);
            expect(scope.values).toEqual(data.data);
        }));

    });
});