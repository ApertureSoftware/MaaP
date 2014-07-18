/**
 * File: RegisterService;
 * Module: app:services;
 * Author: jack;
 * Created: 20/05/14;
 * Version: 0.1;
 * Description: Factory that returns a $resource
 * 	representing the functionality for sing up management;
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 *
 ==============================================
 */
'use strict';

angular.module('services')
    .factory('RegisterService', ['$resource', function ($resource) {
		
		//DO NOT EDIT THE NEXT LINE - Maaperture server will update the var hostURL = 'http://localhost:9000';
		//using the configuration file's settings everytime the server will start up.
		var hostURL = 'http://localhost:9000';
		
        return $resource( hostURL + '/api/signup', {}, {
            'register': {method: 'POST'},
			'createuser': {method: 'PUT'}
        });
    }
    ]);











