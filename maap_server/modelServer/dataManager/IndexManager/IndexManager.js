/**
 * File: IndexManager.js
 * Module: maap_server::modelServer::dataManager::IndexManager
 * Author: Michele Maso
 * Created: 20/05/14
 * Version: 1.0.0
 * Description: gestione indici
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
//mostra tutti i warning possibili
'use strict';
//carico il modulo di MongooseDBAnalysis per il db di analisi
var DB = require('../../database/MongooseDBAnalysis');
//carico il modulo di MongooseDBAnalysis per le query
var queryModel = require('../../database/MongooseDBFramework').query;
var connection = require('../../database/MongooseDBFramework').connection;

 /**
 * Recupera il file con la lista delle collections
 *
 *@return lista delle collections presenti nel sistema in formato json
 */
var getCollectionsListFile = function(){
	//ritorno la lista delle collection
	return require('../../DSL/collectionData/collectionsList.json');
}

 /**
 * Richiede al modulo MongooseDBAnalysis il modello della Collection di nome
 *collection name. Se la Collection è presente, la funzione getModel ritorna il suo modello, altrimenti ritorna -1.
 *
 *@param collection_name - Stringa contenente il nome della Collection di cui ottenere il modello.
 *@return modello relativo alla collection specificata, -1 se il modello non è presente.
 */
var getModel = function(collection_name) {
	
	//prendo tutti i modelli
	var array = DB.model;
	
	//scorro l'array di modelli
	for(var i=0; i<array.length; i++)
	{
		//controllo se il nome del modello corrisponde al nome passato
		if(array[i].name == collection_name)
		{
			//se ho trovato il modello corrispondente lo faccio ritornare
			return array[i].model;
		}
	}
	//se non trovo nessun modello, ritorno -1
	return -1;
}
//for unit test
//esporto la funzione
exports.getModel = getModel;

 /**
 *Viene richiesto l'insieme delle query effettuate sul database di analisi precedentemente alla query corrente.
 *Successivamente, se la query è stata eseguita per la prima volta, viene inserita nell'insieme delle query effettuate. 
 *Se invece la query è stata già eseguita, il suo contatore viene incrementato.
 *
 *@param collection_name - Stringa contenente il nome della Collection su cui è stata effettuata la query.
 *@param select - Array contenente i campi visualizzati della Collection. 
 */
exports.addQuery = function(collection_name, select) {
	
	//cerca tutte le query relative ad una determinata collection
	var findQueries = queryModel.find({collection_name: collection_name});
	findQueries.lean().exec(function(err,data){
		if(err)
		{
			//se la query da errore allora stampo sulla console un messaggio di errore
			console.log('Impossibile recuperare lista query con la collection ' + collection_name + ': ' + err);
		}else{
			//se la query non da errori allora procedo
			//controllo se la lista che la query ritorna è vuota
			if(data.length == 0)
			{
				//se non e' presente nessuna query relativa alla collection specificata
				//creo una nuova query con il modello corretto, il nome della collection e la lista dei campi select
				//con contatore impostato ad uno
				var criteria = new queryModel({collection_name:collection_name, select:select, counter: 1});
				criteria.save(function(err){
					if(err)
					{
						//se il save da errori stampo un messaggio di errore
						console.log('inserimento query fallito: ' + err);
					}
				});
			}else{
			
				//se la query per la relativa collection e' gia' presente nel database
				var contadata = 0;
				
				//controllo se la lista dei campi selezionati e' identica a quella specificata
				for(var i = 0;i<data.length;i++){
				
					if(data[i].select.length == select.length){
						//contatore
						var countmatch = 0;
						for(var key in select){
							if(data[i].select[key] != undefined)
							{
								countmatch++;		
							}
						}
						
						//se la lista di campi select e' identica, devo incrementare solamente il campo counter
						if(countmatch == Object.keys(select).length){
							var counter = data[i].counter + 1;
							var id2update = data[i]._id;
							
							//aggiorno la query con il campo counter incrementato
							queryModel.update({_id: id2update}, {$set:{counter: counter}}).exec(function(err,count){
								if(err){console.log('update counter fallito: ' + err); }
								else if(count==0){
									//visualizzo l'errore in caso l'update non trova la query da aggiornare
									console.log('impossibile aggiornare la query.'); 
								}
							});
						}else{
							contadata++;
						}
					}
				}//for
				
				if(contadata == data.length)
				{
					//qui non ho fatto nessun update, quindi inserisco una nuova query con counter impostato
					//ad uno
					var criteria = new queryModel({collection_name:collection_name, select:select, counter: 1});
					criteria.save(function(err){
						if(err)
						{
							//visualizzo e stampo l'errore
							console.log('inserimento query fallito 2: ' + err);
						}
					});
				}
			}//else	
		}
	});
}

 /**
 * Richiede il modello della Collection delle query, su cui poi viene applicato il metodo
 *dropCollection che resetta la Collection delle query nel database.
 *
 *@param callback - callback da richiamare al termine dell'esecuzione della funzione.
 */
exports.resetQueries = function(callback) {
	
	//elimino l'intera collezione di query nel database
	connection.db.dropCollection(queryModel.modelName, function(err,data){
		if(err){
			//notifico l'utente in caso di errore
			console.log('Impossibile cancellare la collection '+ queryModel.modelName + ': ' + err);
			//richiamo la callback con false
			callback(false);
		}
		else{
			//in caso positivo richiamo la callback con true
			callback(true);
		}
	});
}

 /**
 * Richiede l'intera Collection delle query al database di analisi. Calcola il sottoinsieme di query da visualizzare 
 *tenendo conto dell'indicatore della pagina da visualizzare e dagli elementi da visualizzare per pagina.
 *Esegue quindi una nuova query per ottenere l'insieme delle query che rispettano suddetti parametri. 
 *Se avviene un errore o se non esistono query che rispettano i parametri scelti, viene passato alla
 *callback un oggetto vuoto. Se invece la ricerca ha avuto esito positivo, viene richiamata la callback 
 *passando come parametro l'insieme delle query che soddisfano i requisiti.
 *
 *@param page - Numero intero che indica la pagina delle query da visualizzare.
 *@param perpage - Numero intero che indica il numero di query da visualizzare per pagina. 
 *@param n_elements - Numero intero che indica il numero di query totali da visualizzare.
 *@param callback - funzione da richiamare al termine dell'esecuzione
 */
exports.getQueries = function(page, perpage, n_elements, callback) {
	
	//creo un array vuoto di opzioni
	var options = {};
	
	//aggiungo lo skip, ovvero da dove partire a prendere gli elementi, alle opzioni
	options.skip = page * perpage;
	//aggiungo il limit, ovvero quanti elementi prendere, alle opzioni
	options.limit = perpage;
	//aggiungo il tipo di ordinamento alle opzioni
	options.sort = {counter:'desc'};
	
	//creo un array di risultati vuoto
	var result = {};
	result.data = [];
	result.options = {};
	
	//faccio la query su db per recuperare i dati
	queryModel.find({}, function(err, queries){
		//controllo se la query da problemi
		if(err) { 
			//se la query da problemi allora stampo un messaggio di errore sulla console
			console.log('errore recupero query list: ' + err); callback(result); 
		}
		else if(!queries){
			//se non ci sono query allora stampo un messaggio di errore
			console.log('no queries!');
			//do alla callback il risultato
			callback(result);
		}else{
			//se ci sono delle query
			//calcolo il numero di pagine da visualizzare
			result.options.pages = Math.floor(queries.length / perpage);
			//se la divisione ha resto, allora aumento il numero di pagine di 1
			if((queries.length % perpage) > 0) result.options.pages++;
			//definisco la query
			var query = queryModel.find({},{},options);
			//eseguo la query e trasformo il risultato in JSON
			query.lean().exec(function(err,data){
				//controllo se la query dà errori
				if(err){
					//se la query da problemi allora stampo un messaggio di errore sulla console
					console.log('Impossibile ritornare le query: ' + err);
					//do alla callback il risultato
					callback(result);
				}
				//controllo se il risultato è nullo
				if(!data)
				{
					//se il risultato è nullo allora stampo un messaggio sulla console
					console.log('Non ci sono query da visualizzare');
				}else{
					//se il risultato non è vuoto allora lo aggiungo all'array di risultati
					result.data = data;
				}
				//do alla callback il risultato contenenti le query da visualizzare
				callback(result);
			});
		}		
	});
}

 /**
 * Recupera la lista di indici presenti nel database
 *
 *@param db - contiene il db dove cercare gli indici.
 *@param page - numero di pagina da visualizzare.
 *@param indexesPerPage - numero di indici da visualizzare per pagina .
 *@param callback - funzione da richiamare al termine dell'esecuzione.
 */
exports.getIndex = function(db, page, indexesPerPage, callback) {

	//deinisco un array vuoto di risultati
	var result = [];
	//variabile di supporto per rendere la funzione sincrona
	var done = false;
	
	//prendo la lista di collection
	var collectionsList = getCollectionsListFile();
	
	//scorro la lista di collection
	for(var i=0; i<collectionsList.length; i++)
	{
		//prendo il nome i-esimo della collection
		var collectionName = collectionsList[i].name;
		//prendo la collection
		var collection = db.collection(collectionName);
		done = false;
		//sulla collection chiamo indexInformation per ottenere gli indici di quella collection
		collection.indexInformation(function(err, indexes) {
		
			//visualizzo errore in caso
			if(err){console.log('error reading indexes: ' + err);}
			
			//scorro gli indici
			for(var key in indexes)
			{
				if(key != '_id_')	
					//non aggiungo gli indici di default _id_
					result.push({indexName: key, collectionName: collectionName, indexFields: indexes[key]});
			}
			done = true;
		});
		//voglio rendere la funzione sincrona per eseguire tutto il for e poi chiamare la callback
		while(!done){require('deasync').sleep(100);}
	}
	
	var answer = {};	
	answer.options = {};
	//calcolo il numero di pagine per visualizzare gl indici ritornati
	answer.options.pages = Math.floor(result.length / indexesPerPage);
	//controllo se il resto della divisione è >0 allora aggiungo una pagina in più
	if((result.length  % indexesPerPage) > 0) answer.options.pages++;
	
	//restringo l'array in base al page e perpage
	var skip = page * indexesPerPage;
	var limit = indexesPerPage;
	result = result.slice(skip, skip + limit);
	answer.indexes = result;
		
	//passo alla callback l'array di indici
	callback(answer);
	
}

 /**
 * Viene richiesto il modello della query, grazie a cui viene cercata nel database di analisi la query con campo id uguale al parametro id.
 *Se la query non esiste o si riscontrano problemi di accesso al database, viene chiamata la funzione callback con argomento false. 
 *Altrimenti viene caricato lo schema della Collection su cui la query viene eseguita. 
 *Sulla collection viene creato l'indice voluto. Se l'operazione di creazione non ha successo, viene viene chiamata la funzione callback con argomento
 *false, altrimenti viene chiamata la callback con argomento true.
 *
 *@param query_id - Id identificativo della query da associare all'indice da creare.
 *@param name_index - Stringa contenente il nome dell'indice da creare.
 *@param callback - funzione da richiamare al termine dell'esecuzione.
 */
exports.createIndex = function(query_id, name_index, callback) {
	//creo l'oggetto per la condizione where di una query
	var where = {};
	where['_id'] = query_id;
	//creo l'oggetto per il select di una query
	var select = {};
	//definisco la query
	var query = queryModel.find(where,select);
	//eseguo la query sul db
	query.lean().exec(function(err,data){
		//controllo se la query da errori
		if(err){
			//se la query da errori allora stampo un messaggio di errore
			console.log('Impossibile ritornare la query dell\' indice: ' + err);
			//passo false alla callback
			callback(false);
		}else 
		//controllo se la query non da risultati
		if(!data)
		{
			//se non c'è risultato allora stampo un messaggio di errore
			console.log('Errore _id query cercata');
			//passo false alla callback
			callback(false);
		}else 
		//se la query produce risultato
		if(data.length > 0){
			//recupero il nome della collection		
			var collection_name = data[0].collection_name;		
			//recupero i campi della select della query
			var fieldIndex = data[0].select;
			//creo un oggetto index vuoto
			var index = {};
			//scorro ogni campo in fieldIndex
			for(var key in fieldIndex){
				//aggiungo il campo dentro l'oggetto index e lo imposto a 1
				index[key] = 1;
			}
			
			//imposto il nome dell'indice
			name_index = query_id;
			//creo l'oggetto nameindex vuoto
			var nameindex = {};
			//imposto il nome di nameindex con il nome dell'indice
			nameindex.name = name_index;
			//prelevo lo schema della collection
			var collectionSchema = require('../../DSL/collectionData/' + collection_name + '_schema').schema;
			//rimuovo eventuali indici nello schema
			collectionSchema._indexes = [];
			//definisco un indice nello schema
			collectionSchema.index(index, nameindex);
			//prendo il model della collection		
			var collectionModel = getModel(collection_name);
			//provo a creare l'indice
			collectionModel.ensureIndexes(function(err){
				//controllo se la creazione dell'indice ha prodotto errori
				if(err)
				{
					//se la creazione ha prodotto errori allora stampo un messaggio sulla console
					console.log('Impossibile creare l\'indice: ' + err);
					//passo false alla callback
					callback(false);
				}else{
					//se la creazione non ha prodotto errori
					//indice creato correttamente
					//passo true alla callback
					callback(true);
				}
			});
			
		}else{
		//se non c'è risultato allora passo false alla callback
			callback(false);
		}
	});
}

 /**
 * Viene cancellato nella collection specificata con collectionName l'indice specificato con indexName.
 *Se l'operazione di eliminazione non ha successo, viene chiamata la funzione callback con argomento false, 
 *altrimenti viene chiamata la callback con argomento true.
 *
 *@param db - Il database su cui cercare gli indici.
 *@param name_index - Stringa contenente il nome dell'indice da creare.
 *@param callback - funzione da richiamare al termine dell'esecuzione.
 */
exports.deleteIndex = function(db, indexName, collectionName, callback) {

	//prendo la collection
	var collection = db.collection(collectionName);
	//cancello un indice dalla collection
	collection.dropIndex(indexName, function(err, result){
		//controllo se la cancellazione ha prodotto errori
		if(err)
		{
			console.log('error while deleting index: ' + err);
			//se la cancellazione ha prodotto errori, allora passo false alla callback
			callback(false);
		}else{
			//se la cancellazione non ha prodotto errori, allora passo true alla callback
			callback(true);
		}	
	});	
	
}
