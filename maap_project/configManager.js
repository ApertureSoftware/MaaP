/**
 * File: configManager.js
 * Module: maap_project
 * Author: Alberto Garbui
 * Created: 30/05/14
 * Version: 0.1
 * Description: recupera il file di config corretto
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
'use strict';

exports.getConfig = function() {
	var config;
	var config_file = './config_' + (process.env.NODE_ENV ? process.env.NODE_ENV : 'development') + '.js';
  
	try {
	  config = require(config_file);
	  return config;
	} catch (err) {
	  if (err.code && err.code === 'MODULE_NOT_FOUND') {
		console.error('No config file matching NODE_ENV=' + process.env.NODE_ENV 
		  + '. Maaperture requires "' + __dirname + '/' + process.env.NODE_ENV + '.js"');
		process.exit(1);
	  } else {
		throw err;
	  }  
	}
}

exports.getHostUrl = function(config) {
	var url = 'http';
	if(config.app.ssl)
		url = url + 's';

	url = url + '://' + config.app.host + ':' + config.app.port;
	return url;
}
