/**
 * File: frontController.js
 * Module: maap_server::controller
 * Author: Alberto Garbui
 * Created: 03/05/14
 * Version: 1.0.0
 * Description: inizializzazione front controller
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
 //mostra tutti i warning possibili
'use strict';

//prelevo il modulo riguardante il dispatcher
var dispatcher = require("./dispatcher");

 /**
 *Inizialliza il dispatcher e configura l'applicazione express per usare il dispatcher.
 *
 *@param app contiene il middleware express
 */
var initFrontController = function(app) {

	var new_dispatcher = dispatcher.init(app);
	
	//configuro l'app per reindirizzare tutte le richieste al dispatcher
	app.use('/', new_dispatcher);

}

//esporto la funzione per inizializzare il front controller
exports.init = initFrontController;
