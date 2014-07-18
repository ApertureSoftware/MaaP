/**
 * File: index.js
 * Module: maap_server::controller
 * Author: Alberto Garbui
 * Created: 02/05/14
 * Version: 1.0.0
 * Description: inizializzazione controller
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
 //mostra tutti i warning possibili
'use strict';

//prelevo il modulo riguardante il front controller
var frontController = require('./frontController');

 /**
 *Viene inizializzato il front controller passandogli l'app di express.
 *
 *@param app contiene il middleware express
 */
exports.init = function(app){
	
	//stampo sulla console un messaggio di inizializzazione controller
	console.log("controller init...");
	
	//inizializzo il frontController
	frontController.init(app);	
	
}
