/**
 * File: index.js
 * Module: maap_server::modelServer::DSL
 * Author: Alberto Garbui
 * Created: 20/05/14
 * Version: 1.0.0
 * Description: inizializzazione DSL
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
'use strict';

var DSL = require('./DSLManager');

exports.init = function(app) {

	console.log('checking dsl... ');
	DSL.checkDSL(app);
}
