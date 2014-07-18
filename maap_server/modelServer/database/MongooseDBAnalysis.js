/**
 * File: MongooseDBAnalysis.js
 * Module: maap_server::modelServer::database
 * Author: Fabio Miotto
 * Created: 23/05/14
 * Version: 1.0.0
 * Description: gestione db di analisi
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
 //mostra tutti i warning possibili
'use strict';
var fs = require('fs');
var path = require('path'); 
var mongoose = require('mongoose');

//prendo il percorso dove è contenuta la lista di collection
var collectionDataPath = __dirname + '/../DSL/collectionData';

 /**
 * Inizializza il database di analisi creando i modelli per ogni schema presente nella cartella collectionData e
 * ed esporta tutti i modelli creati in un unico array
 *
 *@param app - applicazione express contenente la configurazione del sistema
 */
exports.init = function(app) {
	
	var config = app.config;
	var db = app.db.data;

	//per ogni collection definita tramite DSL
	//definisco i modelli (devono essere generati automaticamente dal DSL automatici dal DSL parser...)

	var modelArray = [];
	
	var list = fs.readdirSync(collectionDataPath);
	var schemaIsReady = list.length;
	
	console.log('generating models...');
	
	//scorro la lista di collection
    list.forEach(function(file) {	
	    var filePath = collectionDataPath + '/' + file;
        var stat = fs.statSync(filePath);
		var extension = path.extname(file);
		//controllo di trovare un file '*_schema.js' e carico i
        if (stat && stat.isFile() && extension == '.js' && file.indexOf('_schema') > -1) {
			var collectionName = require(collectionDataPath + '/' + file).schemaName;
			var schema = require(collectionDataPath + '/' + file).schema;	
			var wrapperSchema = {};
			wrapperSchema.name = collectionName;
			wrapperSchema.model = db.model(collectionName, schema);
			modelArray.push(wrapperSchema);
		}
		schemaIsReady--;
	});
	
	while(schemaIsReady > 0){require('deasync').sleep(100);}
	
	//esporto i modelli
	exports.model = modelArray;
}
