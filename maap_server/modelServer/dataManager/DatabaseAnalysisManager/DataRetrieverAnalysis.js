/**
 * File: DataRetrieverAnalysis.js
 * Module: maap_server::modelServer::dataManager::DatabaseAnalysisManager
 * Author: Mattia Sorgato
 * Created: 20/05/14
 * Version: 1.0.0
 * Description: recupero dati dal database di analisi
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
'use strict';

var indexManager = require('../IndexManager/IndexManager');
var DB = require('../../database/MongooseDBAnalysis');

//utilizzo il modulo q per la gestione delle promesse
var Q = require('q');

 /**
 * Recupera il file con la lista delle collections
 *
 *@return lista delle collections presenti nel sistema in formato json
 */
var getCollectionsListFile = function(){
	return require('../../DSL/collectionData/collectionsList.json');
}

 /**
 * Preleva il modello relativo ad una specifica collection
 *
 *@param collection_name - nome della collection relativa al modello da cercare
 *@return modello relativo alla collection specificata, -1 se il modello non è presente.
 */
var getModel = function(collection_name) {
	
	var array = DB.model;
	
	for(var i=0; i<array.length; i++)
	{
		if(array[i].name == collection_name)
		{
			return array[i].model;
		}
	}
	return -1;
}
//for unit test
exports.getModel = getModel;

 /**
 * Preleva i dati di un documento per visualizzarli nella pagina documentShow
 *
 *@param model - modello di mongoose su cui effettuare la query
 *@param querySettings - impostazioni sulla query da effettuare
 *@param populate - definizione del populate da effetturare durante la query
 *@param callback - funzione da eseguire al termine delle operazioni
 */
var getDocuments = function(model, querySettings, populate, callback){
		
	var options = {};
	var sort = {};
	
	//imposto l'ordinamento se sono specificate la colonna su cui ordinare ed il tipo di ordinamento
	if(querySettings.orderbycolumn != '' && querySettings.typeorder != ''){
		sort[querySettings.orderbycolumn] = querySettings.typeorder;
		options.sort = sort;
	}
	
	//imposto il limite per la query
	if(querySettings.numberofrow != ''){
		options.limit = querySettings.numberofrow;
	}
	
	//imposto lo skip della query
	if(querySettings.startskip != ''){
		options.skip = querySettings.startskip;
	}
		
	//preparo la query
	var query = model.find(querySettings.where, querySettings.select, options);
	
	//se populate non e' vuoto, setto la query con il relativo populate
	if(populate != [])
	{
		var populatePath = [];
		var populateField = [];
		
		for(var i=0; i<populate.length; i++)
		{
			populatePath.push(populate[i].key);
			populateField.push(populate[i].field);
		}

		var selectPopulate = [];	
		for(var i=0; i<populateField.length; i++)
		{
			selectPopulate[populateField[i]]=1;
		}	
		
		for(var i=0; i<populatePath.length; i++)
		{
			query.populate({
				path: populatePath[i],
				select: selectPopulate[i]
			})
		}
	}
		
	//eseguo la query
	query.lean().exec( function(err,result){
	
		if(err){console.log('query fallita' + err); callback({}); return;}
					
		//a questo punto la query ha avuto successo,
		//controllo se la query e' stata eseguita su tutti i campi
		
		//se select era indefinito, creo l'oggetto vuoto
		if(querySettings.select == undefined)querySettings.select = {};
		
		//per tutte le chiavi dell'oggetto select
		if(Object.keys(querySettings.select).length == 0)
		{
			//se sono stati selezionati tutti i campi, ora riempio la select per scrivere la query nel db
			if(result.length > 0)
			{
				for(var key in result[0])
				{
					querySettings.select[key] = 1;			//carico le chiavi utilizzate
				}
				indexManager.addQuery(model.modelName,  	//nome della collection
									  querySettings.select	//campi select
									);
			}			
		}else{
			//se la select era definita parzialmente aggiungo la query con l'indexManager
			indexManager.addQuery(model.modelName,  	//nome della collection
								  querySettings.select	//campi select
								  );
		}

		//se ci sono risultati
		if(result.length > 0){
		
			//se è stato specificato il populate, sostituisco i vari populate...			
			if(populate!=[])
			{
				for(var i=0; i<result.length; i++)
				{
					var obj = result[i];
										
					//estraggo le informazioni corrette
					for(var attributename in obj)
					{
						//se un campo dati e' nullo lo sostituisco con un trattino :)
						if(obj[attributename] == undefined)
						{
							obj.attributename = '-';
							continue;
						}
						
						for(var j=0; j<populatePath.length; j++)
						{
							if(attributename == populatePath[j])
							{
								//creo il nuovo campo con il valore derivante dal populate
								var newfield = obj[populatePath[j]][populateField[j]];
								obj[populatePath[j] + '.' + populateField[j]] = newfield;
							}
						}
					}
								
					//pulisco i campi populate complessi ora che ho estratto tutte le info
					for(var attributename in obj)
					{
						for(var j=0; j<populatePath.length; j++)
						{
							if(attributename == populatePath[j])
							{
								delete obj[populatePath[j]];
							}
						}
					}

				}
			}
			
			//ritorno il risultato
			callback(result);
					
		}else{
			//nessun risultato, array vuoto
			callback([]);
		}
	});	
}

/**
 * Ritorna la lista di collections presenti nel sistema, se e' definito un campo find di ricerca
 * restringe il risultato alle sole collections che contengono il campo find all'interno della label
 *
 *@param find - stringa da cercare all'interno delle etichette delle collections
 *@return lista delle collections presenti nel sistema, eventualmente ristrette al campo find
 */
exports.getCollectionsList = function(find) {
	
	//prelevo il file contenente la lista delle collections
	var collectionsList = getCollectionsListFile();
	
	//se il campo find di ricerca e' definito e non vuoto
	if(find != undefined && find != '')
	{
		//preparo il risultato
		var result = [];
		
		//scorro tutte le collections
		for(var i=0; i<collectionsList.length; i++)
		{
			var label = (collectionsList[i].label).toLowerCase();
			find = find.toLowerCase();
			
			//se l'etichetta contiene il campo find
			if(label.indexOf(find) != -1)
			{
				//inserisco la collection nell'array dei risultati
				result.push(collectionsList[i]);
			}		
		}

		//mando la lista di risultati sempre, anche vuota se serve!
		collectionsList = result;
	}
	
	//restituisco la lista delle collections
	return collectionsList;
	
}

/**
 * Preleva un file contenente la trasformazione da applicare ad un determinato campo
 *
 *@param collection_name - nome della collection relativa alla trasformazione richiesta
 *@param type - tipo di pagina a cui fa riferimento la trasformazione [index, show]
 *@param fieldName - nome del campo relativo alla trasformazione richiesta
 *@return file di trasformazione richiesto
 */
var getTransformationFile = function(collection_name, type, fieldName) {
	return require('../../DSL/collectionData/transformation_' + collection_name + '_' + type + '_' + fieldName + '.js');
};
//for unit test
exports.getTransformationFile = getTransformationFile;

/**
 * Applica le varie trasformazioni presenti nel dsl ai vari campi dei documents nell'array di documents
 *
 *@param collection_name - nome della collection relativa alla trasformazione da applicare
 *@param type - tipo di pagina a cui fa riferimento la trasformazione [index, show]
 *@param documentsArray - array di documenti da modificare
 *@param dslArray - array di trasformazioni da applicare
 *@return array di documenti a cui sono state applicate le trasformazioni
 */
var applyTransformations = function(collection_name, type, documentsArray, dslArray) {

	//per tutte le trasformazioni
	for(var i=0; i<dslArray.length; i++)
	{
		//se la trasformazione non e' nulla
		if(dslArray[i].transformation != null)
		{
			var fieldName = dslArray[i].name;
			
			//prelevo il file di trasformazione
			var transformation = getTransformationFile(collection_name, type, fieldName).transformation;
			
			//applico le trasformazioni per tutti i documenti
			for(var j=0; j<documentsArray.length; j++)
			{
				var document = documentsArray[j];
				for(var attributename in document)
				{
					if(attributename == fieldName)
					{
						//applico la trasformazione
						document[attributename] = transformation(document[attributename]);
						
						//se e' indefinito visualizza un trattino
						if(document[attributename] == undefined) document[attributename]= '-';
					}
				}
			}
		}	
	}
	return documentsArray;
}
//for unit test
exports.applyTransformations = applyTransformations;

/**
 * Ordina i documenti seguendo l'ordine dettato dall'array di chiavi fornito in ingresso
 *
 *@param documents - array di documents da ordinare
 *@param keys - array di chiavi che dettano il tipo di ordinamento
 *@return array di documenti ordinati
 */
var sortDocumentsByLabels = function(documents, keys) {
	var result = [];
	
	//per tutti i documenti
	for(var i=0; i<documents.length; i++)
	{
		var sortedDocument = {};
		//ordino tutte le chiavi
		for(var j=0; j<keys.length; j++)
		{
			sortedDocument[keys[j]] = documents[i][keys[j]];
			if(sortedDocument[keys[j]] == undefined)
				sortedDocument[keys[j]] = '-';
		}
		result.push(sortedDocument);
	}	
	
	//restituisco l'array con i documenti ordinati
	return result;
}

/**
 * Conta i documenti di una determinata collection
 *
 *@param model - modello della collection su cui si vuole eseguire il conteggio dei documenti
 *@param where - eventuale campo per inserire una query per restringere il conteggio
 *@return promessa di esecuzione della query
 */
var countDocuments = function(model, where) {

	//creazione della promessa
	var deferred = Q.defer();

	//definizione della query di conteggio documenti
	model.count(where, function(err, count){
		if(err)
		{
			//in caso negativo visualizza l'errore e conclude la promessa ritornando zero
			console.log('countDocuments err: ' + err);
			deferred.resolve(0);
		}else{
			//in caso positivo concludo la mia promessa ritornando il risultato
			deferred.resolve(count);
		}		
	});

	//restituisco la promessa
	return deferred.promise;
}
//for unit test
exports.countDocuments = countDocuments;

/**
 * Esegue una determinata query specificata
 *
 *@param query - query da eseguire
 *@return promessa di esecuzione della query
 */
var findDocuments = function(query) {

	//creo la promessa
	var deferred = Q.defer();

	//eseguo la query
	query.lean().exec(function(err, result){
		if(err)
		{
			//in caso d'errore visualizzo l'errore e termino la promessa ritornando un array vuoto
			console.log('findDocuments err: ' + err);
			deferred.resolve([]);
		}else{
			//in caso positivo termino la promessa restituendo il risultato della query
			deferred.resolve(result);
		}
	});

	//restituisco la promessa
	return deferred.promise;
}
//for unit test
exports.findDocuments = findDocuments;


/**
 * Preleva i documenti relativi ad una determinata collection per visualizzarli nella pagina CollectionIndex
 *
 *@param model - modello della collection su cui si vogliono prelevare i documenti
 *@param querySettings - impostazioni per l'esecuzione della query
 *@return promessa di esecuzione dell'operazione
 */
var getDocumentsForIndex = function(model, querySettings){

	//inizio la creazione della promessa
	var deferred = Q.defer();
	
	//estraggo le varie impostazioni
	var where = querySettings.where;
	var select = querySettings.select;
	var column = querySettings.column;
	var order = querySettings.order;
	var page = querySettings.page;
	var perpage = querySettings.perpage;
	var populate = querySettings.populate;
	
	console.log(JSON.stringify(querySettings));
		
	var numberOfPages = 0;
	var totDocuments = 0;
	var undefinedCount = 0;
	var definedCount = 0;
	var firstResult = [];
	
	//Gestione del populate
	var populatePath = [];
	var populateField = [];
	
	for(var i=0; i<populate.length; i++)
	{
		populatePath.push(populate[i].key);
		populateField.push(populate[i].field);
	}

	var selectPopulate = [];	
	for(var i=0; i<populateField.length; i++)
	{
		selectPopulate[populateField[i]]=1;
	}		
	
	//conto il numero di documenti presenti nella collection
	countDocuments(model, where)
	
	.then(function(count){
		//calcolo il numero di pagine per visualizzare tutti i documenti
		numberOfPages = Math.floor(count / perpage);
		if((count % perpage) > 0) numberOfPages++;	
		totDocuments = count;
		
		//ritorno una promessa contenente il conteggio dei documenti che non possiedono il 
		//campo da ordinare
		var whereExists = {};
		whereExists[column] = {$exists: false};
		return countDocuments(model, whereExists);
	})
	
	.then(function(count){
	
		//ora conosco quanti documenti posso ordinare e quanti non hanno il campo da ordinare
		undefinedCount = count;
		definedCount = totDocuments - undefinedCount;
				
		//preparo le opzioni per la prossima query
		var options = {
			limit: perpage,
			skip: perpage * page	
		};
		
		//imposto il tipo di ordinamento
		var sort = {};	
		if(querySettings.column != '' && querySettings.order != ''){
			sort[querySettings.column] = querySettings.order;
			options.sort = sort;
		}
			
		//preparo il campo where
		var whereFull = {};
		for(var key in where)
			whereFull[key] = where[key];
						
		//preparo la query e ritorno come promessa l'esecuzione della stessa
		var query = model.find(whereFull, select, options)
		
		//aggiungo al campo where la colonna da ordinare che esista
		query.where(querySettings.column).exists(true);
		
		//imposto la query con il relativo populate
		for(var i=0; i<populatePath.length; i++)
		{
			query.populate({
				path: populatePath[i],
				select: selectPopulate[i]
			})
		}
		
		//restituisco la promessa
		return findDocuments(query);
		
	})
		
	.then(function(result){
		
		//result e' un array di documenti ordinati secondo un certo campo		
		//lo salvo.
		firstResult = result;
						
		if(result.length < perpage && undefinedCount > 0)
		{
			//qui ho meno risultati di quanti potrebbero stare in una singola pagina
			//quindi aggiungo i documents con campi non definiti
			var numberOfPagesDefined = Math.floor(definedCount / perpage);
			if((definedCount % perpage) > 0) numberOfPagesDefined++;	
		
			//resetto le impostazioni della query, in particolare mi interessa
			//rimuovere l'ordinamento secondo un determinato campo
			var options = {};
						
			if(page == numberOfPagesDefined - 1)
			{
				//se la pagina richiesta e' proprio quella intermedia composta da sorted documents ed
				//undefined documents
				options.limit = perpage - result.length;
				options.skip = 0;
							
			}else{
			
				//altrimenti ho solo documents con campo sorted non definito
				options.limit = perpage;	
				options.skip = (perpage * page) - definedCount;
				if(options.skip < 0) options.skip = 0;
				
			}
			
			//preparo la nuova query per prelevare i documents che non contengono il campo
			//da ordinare
			var query = model.find(where, select, options);
						
			query.exists(querySettings.column, false);

			//ritorno la promessa di eseguire la suddetta query
			return findDocuments(query);
				
		}else{
		
			//qui ho gia' riempito la pagina con perpage risultati
			//quindi termino la promessa passando il risultato
			deferred.resolve(result);		
			
		}			
	})

	.then(function(emptyResult){	
	
		//eseguo la concatenazione dei risultati del primo risultato di documenti ordinati
		//assieme al secondo risultato di documenti con il campo da ordinare non presente
		var totResult = {};
		
		if(order != 'desc')
		{
			totResult = firstResult.concat(emptyResult);
		}else{
			totResult = emptyResult.concat(firstResult);
		}
		deferred.resolve(totResult);
	});
		
	//ritorno la promessa al chiamante
	return deferred.promise;
				
}//end function getDocumentsForIndex
//for unit test
exports.getDocumentsForIndex = getDocumentsForIndex;

/**
 * Preleva la lista di documenti da visualizzare nella pagina collectionIndex
 *
 *@param collection_name - nome della collection da gestire
 *@param column - colonna da ordinare
 *@param order - tipo di ordinamento [asc, desc]
 *@param page - pagina da visualizzare
 *@param callback - funzione da eseguire al termine dell'operazione
 */
exports.getCollectionIndex = function(collection_name, column, order, page, callback) {

	//prelevo il modello relativo alla collection specificata
	var model = getModel(collection_name);
	
	try{
		//provo a vedere se la collection e' presente
		var collection = require('../../DSL/collectionData/' + collection_name + '.json').collection;
	
		var columns = collection.index.column;
		
		var labels = [];
		var select = {};
		var populate = [];
		var keys = [];
		
		if(columns != undefined)
		{
			//generazione array di labels
			for(var i=0; i<columns.length; i++){
				if(columns[i].label != null)
				{
					labels[i] = columns[i].label;
				}else{
					labels[i] = columns[i].name;
				}
				keys[i] = columns[i].name;
			}
			keys.push('_id');
		
			for(var i=0; i<columns.length; i++){
				var name = columns[i].name.split('.');
				if(name.length > 1){
					var data = {};
					data.field = name[1];
					data.key = name[0];
					populate.push(data);
				}else{
					if(name[0] == '_id')
					{
						//se il campo _id e' in lista per essere visualizzato
						//aggiorno l'etichetta
						labels[i] = '__IDLABEL2SHOW__' + labels[i];
					}
				}				
				select[name[0]] = 1; 
			}//for
			//select.null = 1;
				
		}
		
		//se la colonna non e' specificata uso le impostazioni del DSL, altrimenti uso le impostazioni
		//derivate dalla richiesta del client			
		if(column == undefined)
		{
			var sortby = collection.index.sortby;
			order = collection.index.order;
		}else{
			//controllo la colonna da ordinare, se deriva da un campo composto
			var compositeColumn = column.split('.');
			if(compositeColumn.length > 1){
				column = compositeColumn[0];
			}
		
			//setto il campo sortby
			var sortby = column;
		}
		
		//prelevo il numero di documents da visualizzare per pagina
		var perpage = collection.index.perpage;
		
		//preparo il campo where
		var where;
		if(collection.index.query == null)
			where = {};
		else
			where = collection.index.query;
			
		//controllo se devo gestire il populate
		if(populate != [])
		{
			var populatePath = [];
			var populateField = [];
			
			for(var i=0; i<populate.length; i++)
			{
				populatePath.push(populate[i].key);
				populateField.push(populate[i].field);
			}

			var selectPopulate = [];	
			for(var i=0; i<populateField.length; i++)
			{
				selectPopulate[populateField[i]]=1;
			}	
		}		
			
		var result = {};
		var querySettings = {};
		
		//inizio contando tutti i documenti presenti nella collection
		countDocuments(model, where)
		
		.then(function(count){
		
			//calcolo il numero di pagine totali per visualizzarli
			result.options = {};
			result.options.pages = Math.floor(count / perpage);
			if((count % perpage) > 0) result.options.pages++;
			
			//restituisco una promessa di recupero dei documenti
			querySettings.where = where;
			querySettings.select = select;
			querySettings.column = sortby;
			querySettings.order = order;
			querySettings.page = page;
			querySettings.perpage = perpage;
			querySettings.populate = populate;
			
			//ritorno la promessa di esecuzione di getDocumentsForIndex
			return getDocumentsForIndex(model, querySettings);	
			
		})
								
		.then(function(documents){
		
			//controllo quanti documenti ho recuperato
			if(documents.length == 0)
			{
				//se la lista e' vuota, rispondo con un oggetto vuoto
				console.log('got zero documents!');
				callback({});
			}else{
			
				//a questo punto la query ha avuto successo,
				//controllo se la query e' stata eseguita su tutti 
				if(querySettings.select == undefined)querySettings.select = {};
				
				if(Object.keys(querySettings.select).length == 0)
				{
					//se sono stati selezionati tutti i campi, ora riempio la select per scrivere la query nel db
					for(var key in documents[0])
					{
						querySettings.select[key] = 1;			//carico le chiavi utilizzate
					}
					indexManager.addQuery(model.modelName,  	//nome della collection
										  querySettings.select	//campi select
										);			
				}else{
					//se la select era definita parzialmente aggiungo la query con l'indexManager
					indexManager.addQuery(model.modelName,  	//nome della collection
										  querySettings.select	//campi select
										  );
				}
			
				//se è stato specificato il populate, sostituisco i vari populate...			
				if(populate != [])
				{
		
					for(var i=0; i<documents.length; i++)
					{
						var obj = documents[i];
											
						//estraggo le informazioni corrette
						for(var attributename in obj)
						{
							//se un campo dati e' nullo lo sostituisco con un trattino :)
							if(obj[attributename] == undefined)
							{
								obj.attributename = '-';
								continue;
							}
							
							for(var j=0; j<populatePath.length; j++)
							{
								if(attributename == populatePath[j])
								{
									var newfield = obj[populatePath[j]][populateField[j]];
									obj[populatePath[j] + '.' + populateField[j]] = newfield;
								}
							}
						}
									
						//pulisco i campi populate complessi ora che ho estratto tutte le info
						for(var attributename in obj)
						{
							for(var j=0; j<populatePath.length; j++)
							{
								if(attributename == populatePath[j])
								{
									delete obj[populatePath[j]];
								}
							}
						}

					}
				}//end if populate != []
						
				if(columns != undefined)
				{
				
					//qui columns del dsl e' definita
					result.labels = labels;	
					documents = sortDocumentsByLabels(documents, keys);
					result.documents = applyTransformations(collection_name, 'index', documents, columns);
				
				}else{	
				
					//nel caso la column non sia definita
					result.labels = [];
					if(documents.length > 0)
					{
						for(var key in documents[0])
						{
							result.labels.push(key);
						}
					}
					result.documents = documents;	//documents senza trasformazioni
				}
				
				//al termine richiamo la callback con l'oggetto result
				//contenente le etichette, i documenti ed il numero di pagine
				callback(result);						
			}
		});
			
	}catch(err){
		//se la collection non e' presente, rispondo con -1
		console.log('err: ' + err);
		callback(-1);
	}
}

/**
 * Preleva i dati relativi ad un documento da visualizzare nella pagina documentShow
 *
 *@param collection_name - nome della collection da gestire
 *@param document_id - id del documento da visualizzare
 *@param callback - funzione da eseguire al termine dell'operazione
 */
exports.getDocumentShow = function(collection_name, document_id, callback) {

	try{
	
		//preleva il modello relativo alla collection
		var model = getModel(collection_name);
		var collection = require('../../DSL/collectionData/' + collection_name + '.json').collection;
		var rows = collection.show.row;
		
		//generazione array di labels
		var labels = [];
		var select = {};
		var populate = [];
		
		if(rows != undefined)
		{
			var keys = [];
			for(var i=0; i<rows.length; i++){
				if(rows[i].label != null)
				{
					labels[i] = rows[i].label;
				}else{
					labels[i] = rows[i].name;
				}
				keys[i] = rows[i].name;
			}
			keys.push('_id');
			
			for(var i=0; i<rows.length; i++){
				var name = rows[i].name.split('.');
				if(name.length > 1){
					var data = {};
					data.field = name[1];
					data.key = name[0];
					populate.push(data);
				}else{
					if(name[0] == '_id')
					{
						//se il campo _id e' in lista per essere visualizzato
						//aggiorno l'etichetta
						labels[i] = '__IDLABEL2SHOW__' + labels[i];
					}
				}	
				select[name[0]] = 1; 
			}//for
			
		}
		
		//preparo la query impostando l'id del documento da visualizzare
		var query = {};
		query._id = document_id;
		
		//preparo le impostazioni della query
		var querySettings = {};
		querySettings.where = query; 
		querySettings.select = select;
		querySettings.orderbycolumn = '';
		querySettings.typeorder = '';
		querySettings.startskip = 0;
		querySettings.numberofrow = '';
		
		//prelevo i dati del document
		getDocuments(model,
					querySettings,
					populate,			//populate
					function(documents){
						var result = {};
						if(rows != undefined)
						{
							result.labels = labels;	
							documents = sortDocumentsByLabels(documents, keys);
							documents = applyTransformations(collection_name, 'show', documents, rows);
						}else{	
							//nel caso la row non sia definita
							result.labels = [];
							for(var key in documents[0])
							{
								result.labels.push(key);
							}
						}
						result.rows = documents[0];
						callback(result);
					});
	}catch(err){
		//se il document non e' presente, rispondo con la lista vuota
		console.log('err: ' + err);
		callback({});
	}
}

/**
 * Preleva i dati relativi ad un specifico documento per visualizzare la pagina di editing
 *
 *@param collection_name - nome della collection da gestire
 *@param document_id - id del documento da editare
 *@param callback - funzione da eseguire al termine dell'operazione
 */
exports.getDocumentShowEdit = function(collection_name, document_id, callback) {

	//prelevo il modello relativo alla collection specificata
	var model = getModel(collection_name);
	
	//preparo la query con l'id del documento da modificare
	var query = {};
	query._id = document_id;
	
	//setto le impostazioni della query
	var querySettings = {};
	querySettings.where = query; 
	querySettings.select = {};
	querySettings.orderbycolumn = '';
	querySettings.typeorder = '';
	querySettings.startskip = 0;
	querySettings.numberofrow = '';
	
	//eseguo una query pulita e restituisco tutti i dati in formato json senza modifiche
	//per permettere all'utente di modificare i dati a piacimento
	getDocuments(model,
				querySettings,
				'',								//niente populate
				function(document2edit){
					callback(document2edit[0]); //restituisco il primo ed unico json dell'array
				});

}

/**
 * Aggiorna un documento con i nuovi dati passati in ingresso
 *
 *@param collection_name - nome della collection da gestire
 *@param document_id - id del documento da aggiornare
 *@param newDocumentData - oggetto JSON contenente i nuovi dati da scrivere nel document
 *@param callback - funzione da eseguire al termine dell'operazione
 */
exports.updateDocument = function(collection_name, document_id, newDocumentData, callback) {

	//prelevo il modello relativo alla collection specificata
	var model = getModel(collection_name);
	
	//imposto i criteri per l'update (id del documento da aggiornare)
	var criteria = {};
	criteria._id = document_id;
	
	var options = {};	
	for(var key in newDocumentData)
	{
		if(key.indexOf('$') == 0) //rimuovo campi dati con il dollaro se ce ne sono
			delete newDocumentData[key];
	}
	
	//se sto modificando i vari campi dati lasciando invariato l'_id
	if(newDocumentData._id == document_id)
	{
		delete newDocumentData._id; //rimuovo l'_id perchè non posso modificarlo con mongoose
	
		var query = model.update(criteria, {$set: newDocumentData}, options);
		query.lean().exec( function(err, count){
			if(err){console.log('document update fallito: ' + err); callback(false); return;}
			if(count==0){
				//console.log('nessun risultato'); 
				callback(false);
			}else{
				//update avvenuto con successo
				callback(true);
			}
		});
	
	}else{
		
		//altrimenti se l'utente vuole modificare l'id, prima rimuovo il vecchio document
		removeDocument(collection_name, document_id, function(done){
			if(done)
			{
				//ora creo un nuovo document con il nuovo id
				model.create(newDocumentData, function(err){
					if(err)
					{
						callback(false);
					}else{
						//creazione avvenuta con successo
						callback(true);
					}			
				});
				
			}else{
				//rimozione del vecchio document fallito
				callback(false);
			}		
		});
	
	}
}

 /**
 * Elimina il documento di una specifica collection
 *
 *@param collection_name - nome della collection relativa al documento da cancellare
 *@param document_id - id del documento da cancellare
 *@param callback - funzione richiamata al termine dell'esecuzione
 */
var removeDocument = function(collection_name, document_id, callback) {

	//imposto i criteri per la rimozione (l'id del documento da cancellare)
	var criteria = {};
	criteria._id = document_id;
	
	//prelevo il modello della collezione 
	var model = getModel(collection_name);
	
	//preparo la query
	var query = model.remove(criteria);
	
	//eseguo la query
	query.lean().exec( function(err, count){
		if(err){console.log('rimozione document fallita: ' + err); callback(false); return;}
		if(count == 0) {
			//console.log('niente da eliminare'); 
			callback(false);
		}else{
			//rimozione avvenuta con successo
			callback(true);			
		}
	});
	
}
exports.removeDocument = removeDocument;

//esporto le varie funzioni
exports.getModel=getModel;	
exports.sortDocumentsByLabels = sortDocumentsByLabels;
exports.getDocuments = getDocuments;
