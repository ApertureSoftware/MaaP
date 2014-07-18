/**
 * File: Authservice;
 * Module: app:services;
 * Author: Giacomo Pinato;
 * Created: 12/05/14;
 * Version: 0.1;
 * Description: Factory that returns a $resource
 * 	representing the login functionality;
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
'use strict';

angular.module('services')
    .factory('AuthService', ['$resource', function ($resource) {
	
		//DO NOT EDIT THE NEXT LINE - Maaperture server will update the var hostURL = 'http://localhost:9000';
		//using the configuration file's settings everytime the server will start up.
		var hostURL = 'http://localhost:9000';
		
        return $resource( hostURL + '/api/login', {}, {
            'login': {method: 'POST'}
        });
    }
    ]);











