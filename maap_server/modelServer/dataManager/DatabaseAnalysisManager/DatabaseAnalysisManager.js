/**
 * File: DatabaseAnalysisManager.js
 * Module: maap_server::modelServer::dataManager::DatabaseAnalysisManager
 * Author: Mattia Sorgato
 * Created: 20/05/14
 * Version: 1.0.0
 * Description: gestione dati dal database di analisi
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
  //mostra tutti i warning possibili
'use strict';

var path = require('path');
//richiedo il modulo per il data retriever analysis
var retriever = require('./DataRetrieverAnalysis');
//richiedo il modulo per l'index manager
var indexManager = require('../IndexManager/IndexManager');
//richiedo il modulo per il JSonComposer
var JSonComposer = require('../JSonComposer');

 /**
 * invia al client la lista di collections definite dai vari dsl
 *
 *@param req - richiesta del client
 *@param res - risposta per il client
 */
exports.sendCollectionsList = function(req, res) {

	//prelevo il campo da ricercare
	var find = req.params.find; 
	
	if(find == undefined){
		find = '';
	}else{
		console.log('got a find request: ' + find);
	}
	
	//prelevo la lista di collection
	var collectionsList = retriever.getCollectionsList(find);
	//invio al client la lista di collection
	res.send(JSonComposer.createCollectionsList(collectionsList));
}

 /**
 * invia al client la collection richiesta
 *
 *@param req - richiesta del client
 *@param res - risposta per il client
 */
var sendCollection  = function(req, res) {

	//prendo le varie configurazioni
	var config = req.config;
	//prendo il nome della collection
	var collection_name = req.params.col_id;
	//prendo la colonna da ordinare
	var column = req.query.column;
	//prendo il tipo di ordinamento
	var order = req.query.order;
	//prendo la pagina da visualizzare
	var page = req.query.page;
	
	//chiamo la funzione del retriever che mi ritorna la collection richiesta
	retriever.getCollectionIndex(collection_name, column, order, page, function(data){
		
		//controllo se quello che ritorna il retriever è indefinito
		if(data == -1)
		{
			//invio stato HTTP di non trovato
			res.send(404);
		}else{
			//data non è indefinito, quindi posso chiamare il JSonComposer per "impacchettare" la collection
			res.send(JSonComposer.createCollection(	
													//etichette
													data.labels,
													//dati
													data.documents,	
													//opzioni
													data.options	
												   ));
		}
	});	
	
}

 /**
 * invia al client il document richiesto
 *
 *@param req - richiesta del client
 *@param res - risposta per il client
 */
exports.sendDocument = function(req, res){
	//prendo le configurazioni
	var config = req.config;
	//prendo il nome della collection
	var collection_name = req.params.col_id;
	//prendo l'id del document da restituire
	var document_id = req.params.doc_id;
	
	//chiamo la funzione getDocumentShow del retriever che mi restituisce il document richiesto
	retriever.getDocumentShow(collection_name, document_id, function(data){
		
		//controllo se il risultato è vuoto
		if(data.rows == undefined)
		{
			//se il risultato ritornato è nullo allora invio al client uno stato HTTP 404 di non trovato
			res.send(404);
		}else{
			//data non è indefinito, posso cosi chiamare il JSonComposer e creare il document da inviare al client
			res.send(JSonComposer.createDocument( 	
													//etichette
													data.labels,	
													//dati
													data.rows		
												));
		}
	});	
	
}

 /**
 * invia al client il document richiesto per modificarlo
 *
 *@param req - richiesta del client
 *@param res - risposta per il client
 */
exports.sendDocumentEdit = function(req, res){
	//prendo le configurazioni
	var config = req.config;
	//prendo il nome della collection
	var collection_name = req.params.col_id;
	//prendo l'id del document da visualizzare
	var document_id = req.params.doc_id;
	//stampo sulla console un messaggio di richiesta editing di un document
	console.log('_________docEDIT____________');
	//chiamo la funzione getDocumentShowEdit del retriever che restituisce il document richiesto da modificare
	retriever.getDocumentShowEdit(collection_name, document_id, function(document2edit){
		
		//stampo sulla console il document da modificare
		console.log(document2edit);
		//controllo se il document da modificare è vuoto
		if(document2edit == {})
		{
			res.send(document2edit); //per il momento invio sempre i dati anche se vuoti
			//res.send(404);
		}else{
			//document2edit non è indefinito e quindi posso spedire al client il document, ovvero vengono inviati i dati in formato JSON puro
			res.send(document2edit);
		}
	});	
	
}

 /**
 * invia al client uno stato HTTP che indica se l'aggiornamento di un document è andato a buon fine oppure no
 *
 *@param req - richiesta del client
 *@param res - risposta per il client
 */
exports.updateDocument = function(req, res) {
	//prendo le configurazioni
	var config = req.config;
	//prendo il nome della collection
	var collection_name = req.params.col_id;
	//prendo l'id del document da aggiornare 
	var document_id = req.params.doc_id;
	//stampo sulla console un messaggio di modifica document
	console.log('_________docUPDATE____________');
	//chiamo la funzione updateDocument del retriever per salvare le modifiche apportate al document
	retriever.updateDocument(collection_name, document_id, req.body, function(success){
		//controllo se il salvataggio è andato a buon fine
		if(success)
		{
			//se il salvataggio è andato a buon fine, allora invio uno stato HTTP 200 di successo al client
			res.send(200);
		}else{
			//se il salvataggio non è andato a buon fine, allora invio uno stato HTTP 401 di insuccesso al client
			res.send(401);
		}	
	});

}

 /**
 * invia al client uno stato HTTP che indica se la rimozione di un document è andato a buon fine oppure no
 *
 *@param req - richiesta del client
 *@param res - risposta per il client
 */
exports.removeDocument = function(req, res) {
	//prendo le configurazioni
	var config = req.config;
	//prendo il nome della collection
	var collection_name = req.params.col_id;
	//prendo l'id del document da togliere
	var document_id = req.params.doc_id;
	//stampo sulla console un messaggio di rimozione document
	console.log('_________docREMOVE____________');
	//console.log(JSON.stringify(req.body));
	//chiamo la funzione removeDocument del retriever per togliere il document dalla collection
	retriever.removeDocument(collection_name, document_id, function(success){
		//controllo se la rimozione è andata a buon fine oppure no
		if(success)
		{
			//se la rimozione è andata a buon fine allora invio al client uno stato HTTP 200 di successo
			res.send(200);
		}else{
			//se la rimozione non è andata a buon fine allora invio al client uno stato HTTP 401 di insuccesso
			res.send(400);
		}	
	});
	
}

//gestione query - indexManager:

 /**
 * elimino la lista di query e invio uno stato HTTP al client per indicare se la rimozione ha avuto successo oppure no
 *
 *@param req - richiesta del client
 *@param res - risposta per il client
 */
exports.resetQueries = function(req, res) {

	//chiamo la funzione resetQueries dell'IndexManager per eliminare la lista di query
	indexManager.resetQueries(function(done){
		//controllo se la rimozione è andata a buon fine
		if(done)
		{
			//se la rimozione è andata a buon fine allora invio uno stato HTTP 200 di successo al client
			res.send(200);
		}else{
			//se la rimozione non è andata a buon fine allora invio uno stato HTTP 400 di insuccesso al client
			res.send(400);
		}	
	});
}

 /**
 * risponde al client con la lista delle query piu' utilizzate
 *
 *@param req - richiesta del client
 *@param res - risposta per il client
 */
exports.getTopQueries = function(req, res) {
	//prendo dal file di configurazione il valore corrispondente, se è indefinito allora uso 20
	var queriesPerPage = req.config.adminConfig.queriesPerPage || 20;
	////prendo dal file di configurazione il valore corrispondente, se è indefinito allora uso 20
	var numberOfQueries2show = req.config.adminConfig.queriesToShow || 10;
	
	var page = req.query.page;
	console.log('xxxpage: ' + page);
	
	//chiamo al funzione getQueries dell'indexManager per prelevae le query più richieste
	indexManager.getQueries(
							//numero di pagina
							page,			
							//numero di query per pagina
							queriesPerPage,	
							//numero di query da visualizzare							
							numberOfQueries2show,	
							function(queries){
								//invio al client la lista di query più utilizzate, prima però facendo una lista con il JSonComposer
								res.send(JSonComposer.createQueriesList(queries.data, queries.options));							
							});
}

 /**
 * risponde al client con la lista degli indici presenti nel database di analisi
 *
 *@param req - richiesta del client
 *@param res - risposta per il client
 */
exports.getIndexesList = function(req, res) {

	//prendo il db corrispondente
	var db = req.dataDB;
	//prendo dal file di configurazione il valore corrispondente, se è indefinito allora uso 100
	var indexesPerPage = req.config.adminConfig.indexesPerPage || 100;
	
	var page = req.query.page;
	
	//chiamo getIndex di indexManager per ottenere gli indici
	indexManager.getIndex(db, page, indexesPerPage, function(data){
	
		//invio al client una lista di indici create con il JSonComposer
		res.send(JSonComposer.createIndexesList(data.indexes, data.options));
	});	
}

 /**
 * creo un'indice su una query
 *
 *@param req - richiesta del client
 *@param res - risposta per il client
 */
exports.createIndex = function(req, res) {

	//prelevo la query
	var query_id = req.body.id;
	var index_name = req.body.indexName;
	//chiamo createIndex di indexManager per creare l'indice
	indexManager.createIndex(query_id, index_name, function(done){
		//controllo se la creazione ha avuto successo
		if(done)
		{
			//se la creazione ha avuto successo invio al client uno stato HTTP 200 di successo
			res.send(200);
		}else{
			//se la creazione non ha avuto successo invio al client uno stato HTTP 400 di insuccesso
			res.send(400);
		}		
	});
}

 /**
 * elimino un'indice
 *
 *@param req - richiesta del client
 *@param res - risposta per il client
 */
exports.deleteIndex = function(req, res) {

	//prendo il nome dell'indice
	var indexName = req.params.index_name;
	//prendo il nome della collection
	var collectionName = req.params.col_name;
	//prendo il db corrispondente
	var db = req.dataDB;
	//chiamo deleteIndex di indexManager per elimiare l'indice
	indexManager.deleteIndex(db, indexName, collectionName, function(done){
		//controllo se l'eliminazione ha avuto successo
		if(done)
		{
			//se l'eliminazione ha avuto successo, allora invio uno stato HTTP 200 di successo al client
			res.send(200);
		}else{
			//se l'eliminazione non ha avuto successo, allora invio uno stato HTTP 400 di insuccesso al client
			res.send(400);
		}	
	});
}

//esporto la funzione
exports.sendCollection = sendCollection;
