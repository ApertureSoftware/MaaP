/**
 * File: unique;
 * Module: modulo di appartenenza;
 * Author: jack;
 * Created: 20/05/14;
 * Version: versione corrente;
 * Description: descrizione dettagliata del file;
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 *
 ==============================================
 */

/*
* Controlla che la mail inserita nel form di registrazione non sia già utilizzata
* effettuando una chiamata al server ogni volta che si finisce di inserire un indirizzo email valido.
* In caso lo sia invalida il form e non si può procedere con la registrazione.
* */

'use strict';

angular.module('maaperture').
    directive('ensureUnique', ['$http', '$timeout', function ($http, $timeout) {
        var checking = null;
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, c) {
                scope.$watch(attrs.ngModel, function (newVal) {
                    if (!checking) {
                        checking = $timeout(function () {
                            $http({
                                method: 'POST',
                                url: '/api/check/' + attrs.ensureUnique,
                                data: {'field': c.$modelValue}
                            }).success(function (data, status, headers, cfg) {
                                    c.$setValidity('unique', data.isUnique);
                                    checking = null;
                                }).error(function (data, status, headers, cfg) {
                                    checking = null;
                                });
                        }, 500);
                    }
                });
            }
        }
    }]);