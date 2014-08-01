/**
 * File: DataRetrieverUsers.js
 * Module: maap_server::modelServer::dataManager::DatabaseUserManager
 * Author: Fabio Miotto
 * Created: 20/05/14
 * Version: 1.0.0
 * Description: recupero dati dal database degli utenti
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
'use strict';

var DB = require('../../database/MongooseDBFramework');

//nodejs crypto per generare l'HASH sha1 della password
var crypto = require('crypto');

 /**
 * La funzione inserisce un nuovo utente nel database utenti del sistema. Alla fine dell'inserimento,
 *se non sono sollevati errori richiama la funzione callback assegnando come parametro true, altrimenti assegna il parametro false.
 *
 *@param email -Stringa contenente l'indirizzo email del nuovo utente.
 *@param password - Stringa contenente la password del nuovo utente.
 *@param level - Numero intero che identifica il livello di permesso di un utente. Il numero identifica un utente standard, 1 individua un utente admin.
 *@param callback - funzione da chiamare al termine dell'esecuzione
 */
//
exports.addUser = function(email, password, level, callback) {
	
	var criteria = new DB.users({email:email, password: password, level: level});
	var query = criteria.save(function(err){
		 // se l'inserimento fallisce stampo un messaggio di errore
		if(err){
			console.log('impossibile aggiungere nuovo utente: ' + err);
			callback(false);
		}
		// se l'inserimento va a buon fine stampo un messaggio di conferma
		else{ 
			console.log('registrazione ok');
			callback(true);
		}
	});
};

 /**
 * Viene ricercato nel database utenti un utente registrato con id uguale a user id. 
 *Nel caso venga trovato, viene richiamata la funzione callback passando come parametro
 *l'utente trovato, altrimenti viene chiamata con un oggetto vuoto.
 *
 *@param user_id - Id univoco di un utente registrato al sistema.
 *@param callback - funzione da chiamare al termine dell'esecuzione.
 */

var getUserProfile = function(user_id, callback) {
	DB.users.findOne({ _id: user_id },function(err,user){
		//  se la ricerca fallisce stampo un messaggio di errore
		if(err) { 
			console.log('errore recupero user profile: ' + err); callback({});
		}
		// se l'inserimento va a buon fine
		else 
			//se non trovo nessun risultato
			if(!user){
				console.log('no user!');
				callback({});
			}
			// se la ricerca ha dato un risultato e quindi è andato tutto correttamente
			else{
				// Passo user alla callback
				callback(user);
			}
	});
}; 
exports.getUserProfile = getUserProfile;

 /**
 *Vengono estratti i dati da aggiornare dall'oggetto req della richiesta HTTP. 
 *Successivamente viene effettuata una query di aggiornamento sul database degli utenti
 *con i dati forniti da req. In caso l'aggiornamento dei dati avvenga con successo,
 *viene chiamata la funzione callback con argomento true, altrimenti viene chiamata
 *con argomento false.
 *
 *@param req - Oggetto contenente i parametri e le informazioni della richiesta HTTP del Client.
 *@param callback - funzione da chiamare al termine dell'esecuzione.
 */


exports.updateUserProfile = function(req, callback) {

	var model = DB.users;
	
	var cryptoKey = req.config.app.cryptoKey;
	
	var criteria = {};
	criteria._id = req.session.passport.user._id;
		
	var options = {};
	
	var newUserData = {};
	newUserData.email = req.body.email.toLowerCase();
	
	//crypto la nuova password
	if(req.body.newpassword != undefined)
		newUserData.password = crypto.createHmac('sha1', cryptoKey).update(req.body.newpassword).digest('hex');
	
	//recupero dei vecchi dati utenti
	//var oldEmail = req.session.passport.user.email;
	var oldPassword = req.session.passport.user.password;
	
	//il controllo vecchia password non viene eseguito, 
	//la sicurezza si basa sul fatto che questa funzione deve essere
	//richiamata solamente se l'utente e' correttamente autenticato
	//if(oldPassword == req.body.oldPassword)
	//{
	
		// definisco la query di modifica
		var query = model.update(criteria, {$set: newUserData}, options);
		// eseguo la query e trasformo il risultato in JSON
		query.lean().exec( function(err, count){
			// se la query fallisce stampo un messaggio di errore
			if(err){
				console.log('update user profile fallito: ' + err); 
				callback(false);
			}
			// se la query è andata a buon fine
			else 
				// se non si è modificato alcun documento
				if(count == 0){
				// Passo false alla callback
					callback(false);
				}
				//se l'update avvenuto con successo
				else{
				// Passo true alla callback
					callback(true);
				}
		});
}; 

 /**
 * Viene innanzitutto importata l'intera lista degli utenti del sistema. Successivamente,
 * se il risultato della query è vuoto, viene richiamata la funzione callback come
 *argomento un oggetto vuoto. Altrimenti, viene processata l'intera lista al fine di
 *invocare la callback specificando come argomento l'insieme di Document desiderato.
 *I Document saranno quelli che corrispondono alla pagina page correntemente
 *richiesta con l'ordinamento order desiderato sulla colonna scelta column.
 *
 *@param column - Stringa contenente il nome della colonna su cui ordinare gli utenti.
 *@param order - Stringa che specifica l'ordinamento ascendente o discendente degli utenti.
 *@param page - Numero intero che specifica il numero della pagina di utenti da visualizzare.
 *@param perpage - Numero intero che specifica la quantità di utenti da visualizzare per pagina.
 *@param callback - funzione da chiamare al termine dell'esecuzione.
 */

//
exports.getUsersList = function(column, order, page, perpage, callback) {
	// creo un oggetto vuoto per le opzioni della query
	var options = {};
	// creo un oggetto vuoto per le opzioni di ordinamento della query
	var sort = {}; 
	//imposto le opzioni della query con i parametri passati
	sort[column] = order; 
	options.sort = sort; 
	options.limit = perpage;
	options.skip = page * options.limit;
	// creo un oggetto result per i risulati delle query
	var result = {};
	result.options = {};
	result.options.pages = 1;
	result.data = [];
	// eseguo la query per avere tutta la lista degli utenti
	DB.users.find({}, function(err, users){
		//  se la ricerca fallisce stampo un messaggio di errore
		if(err) { console.log('errore user list count: ' + err); callback(result); }
		//  se il risultato della ricerca è vuoto stampo un messaggio
		if(!users){
			console.log('no users!');
			callback(result); 
		}
		// se il risultato della ricerca non è vuoto
		else{
			//calcolo il numero di pagine
			result.options.pages = Math.floor(users.length / perpage);
			if((users.length % perpage) > 0) result.options.pages++;
			// definsco la query di ricerca tra gli utenti con le opzioni definite
			var query = DB.users.find({}, {}, options);	
			// eseguo la query e trasformo i risultati in JSON
			query.lean().exec( function(err,users){
				//  se la ricerca fallisce stampo un messaggio di errore
				if(err) { console.log('errore recupero user list: ' + err); callback(result); }
				else  
					//  se il risultato della ricerca è vuoto stampo un messaggio
					if(!users){
						console.log('no users!');
						callback(result); 
					}
					// se il risultato della ricerca non è vuoto e quindi è andato tutto correttamente
					else{
						result.data = users;
						// Passo result alla callback
						callback(result);
					}
			});			
		}
	});
}; 

/**
 * Vengono estratti i dati da aggiornare dalla richiesta HTTP req inerenti all'utente da aggiornare
 *Successivamente viene effettuata la query di aggiornamento sul
 *modello del database utenti estratto. Infine viene richiamata la funzione callback
 *con argomento true se l'aggiornamento è andato a buon fine, l'argomento è false altrimenti.
 *
 *@param req - Oggetto contenente i parametri e le informazioni della richiesta HTTP del Client.
 *@param callback - funzione da chiamare al termine dell'esecuzione.
 */

exports.updateUser = function(req, callback) {

	var user = req.body;	
	var model = DB.users;
	
	var criteria = {};
	// definisco l'id dell'utente da modificare
	criteria._id = user.id; 
	//se l'utente è di tipo user
	if(user.level == 'user')
	{
		user.level = 0;
	}else 
		//se l'utente è amministratore
		if(user.level == 'administrator')
	{
		user.level = 1;
	}else 
		//se l'utente è amministratore root
		if(user.level == 'root')
	{
		user.level = 2;
	}
	else{
		// Passo false alla callback
		callback(false);
		return;
	}
		
	var options = {};
	
	var newUserData = {};
	newUserData.email = user.email.toLowerCase();
	if(user.newpassword != undefined)
		newUserData.password = crypto.createHmac('sha1', cryptoKey).update(user.newpassword).digest('hex');

	newUserData.level = user.level;
	// definisco la query per modificare l'utente secondo le opzioni
	var query = model.update(criteria, {$set: newUserData}, options);
	// eseguo la query e trasformo il risulatato in JSON
	query.lean().exec( function(err, count){
		//  se la modifica fallisce stampo un messaggio di errore
		if(err){console.log('update user profile fallito: ' + err); callback(false);}
		else
			//  se il risutato della modifica è vuoto
			if(count==0){
				// Passo false alla callback
				callback(false);
			}
			// se il risulato della mododifica non è vuoto e quindi è andato tutto correttamente
			else{
				callback(true);
		}
	});
}; 

/**
 *Viene estratto il modello degli utenti su cui verrà invocato il metodo remove per
 *eliminare l'utente con campo email uguale al parametro email passato alla funzione
 *Al termine della query di eliminazione, viene richiamata la funzione callback
 *con argomento true se l'aggiornamento è andato a buon fine, l'argomento è false altrimenti.
 *
 *@param id - Stringa contenente l'id da rimuovere.
 *@param callback - funzione da chiamare al termine dell'esecuzione
 */

exports.removeUser = function(id, callback) {
	var model = DB.users;
	var criteria = {};
	// definisco l'id da eliminare
	criteria._id = id; 
	// definisco la query di cancellazione
	var query = model.remove(criteria);
	// eseguo la query e trasformo il risulatto in json
	query.lean().exec( function(err, count){
		// se la cancellazione fallisce stampo un messaggio d'errore
		if(err){console.log('rimozione user fallita: ' + err); callback(false);}
		// se il risultato della cancellazione è vuoto
		if(count == 0) {
			callback(false);
		}
		// se il risultato della cancellazione non è vuoto e quindi è andato tutto correttamente
		else{
			callback(true);			
		}
	});
}; 
