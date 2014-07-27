/**
 * File: DatabaseUserManager.js
 * Module: maap_server::modelServer::dataManager::DatabaseUserManager
 * Author: Andrea Perin
 * Created: 20/05/14
 * Version: 1.0.0
 * Description: gestione dati dal database degli utenti
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
//richiedo il modulo per il data retriever users
var retriever = require('./DataRetrieverUsers');
//richiedo il modulo per MongosseDBFramework
var DB = require('../../database/MongooseDBFramework');
//richiedo il modulo per il JSonComposer
var JSonComposer = require('../JSonComposer');
//nodejs crypto per generare l'HASH sha1 della password
var crypto = require('crypto');

/**
 * Effettua un controllo di presenza nel database utenti della email specificata dal Client.
 *In caso di presenza, viene inviato al client un errore http 400. In caso contrario, viene
 *segnalato all'utente la mancanza di un indirizzo email gi‡ registrato e viene inviato il codice http 304.
 *
 *@param req - Oggetto contenente i parametri e le informazioni della richiesta HTTP del Client.
 *@param res - Oggetto duale a req su cui invocare i metodi per inviare informazioni al Client richiedente.
 */
exports.checkMail = function(req, res) {

	//stampo sulla console un messaggio di controllo email
	console.log('controllo mail ' + req.body.field);
	var email2check = req.body.field;
	
	//controllo se la mail Ë indefinita
	if(email2check != undefined)
		email2check = email2check.toLowerCase();
	 
	 //conto nel database quante email presenti a quella da controllare ci sono
	DB.users.count({
  		email: email2check
    }, function (err, count) {
		//controllo se il numero di occorrenze Ë ==0, allora non esiste nessuna mail
        if (count === 0) {
			//stampo sulla console un messaggio di mail non presente
			console.log('nessuna mail presente');
			//invio uno stato HTTP 304
			res.send(304);
        } else {
			//il numero di occorrenze Ë diverso da 0, quindi mail presente
			//stampo sulla console un messaggio di utente gi‡ presente
			console.log('utente gia presente');
			//invio al client uno stato HTTP 400 di insuccesso
			res.send(400);
        }
    });	
};

/**
 * Richiama il metodo addUser di DataRetrieverUsers per registrare un nuovo
 *utente al sistema. Vengono passati al metodo addUser le credenziali contenute nell'oggetto req.
 *In caso di avvenuto inserimento, viene inviato al Client il codice di
 *conferma http 200. In caso contrario, viene inviato il codice di errore http 404.
 *
 *@param req - Oggetto contenente i parametri e le informazioni della richiesta HTTP del Client.
 *@param res - Oggetto duale a req su cui invocare i metodi per inviare informazioni al Client richiedente.
 */
exports.userSignup = function(req, res, next) {
	//stampo sulla console un messaggio di registrazione utente
	console.log('registrazione utente');
	console.log(JSON.stringify(req.body));
	
	//imposto il livello di un utente normale
	var level = 0; //livello zero utente semplice
	
	//controllo se le due password per la registrazione coincidono
	if(req.body.pwd1 != req.body.pwd2)
	{
		//se le due password sono diverse allora non posso registrare l'utente
		//stampo sulla console che la registrazione Ë fallita
		console.log('richiesta registrazione fallita: passwords doesn\'t match!');
		//invio al client uno stato HTTP 400 che indica registrazione fallita
		res.send(400);
		return;
	}
	
	//crypto la password
	var passwordCrypt = crypto.createHmac('sha1', req.config.app.cryptoKey).update(req.body.pwd1).digest('hex');
	
	//prendo la mail inserita dall'utente
	var userMail = req.body.email.toLowerCase();
	
	//controllo che l'utente non sia presente
	DB.users.count({
  		email: userMail
    }, function (err, count) {
        //controllo il numero di occorrenze
		if (count == 0) {
			//se il numero di occorrenze Ë 0 allora l'utente non Ë presente
			//chiamo addUser del retriever per inserire l'utente
			retriever.addUser(userMail, passwordCrypt, level, function(success){
				//controllo se l'inserimento ha avuto successo o no
				if(success)
				{
					//se l'inserimento ha avuto successo allora prendo le credenziali inserite dall'utente
					req.body = {email: userMail, password: req.body.pwd1, level: level};
					next();
				}else{
					//se l'inserimento non Ë andato a buon fine, allora stampo sulla console un messaggio di registrazione fallita
					console.log('richiesta registrazione fallita: inserimento nel db fallito');
					//invio uno stato HTTP al client di insuccesso
					res.send(400);
				}	
			});
        } else {
		//se entro qui allora non posso registrare il client in quanto la mail Ë gia presente
			//stampo sulla console un messaggio di registrazione fallita
			console.log('richiesta registrazione fallita: utente gia presente');
			//invio uno stato HTTP al client di insuccesso
			res.send(400);
        }
    });	
	
};

/**
 * Richiama il metodo getUserProfile di @ÏDataRetrieverUsers per ottenere l'oggetto
 *utente sulla base dei parametri inviati da req. Successivamente invia a res il JSON
 *dell'utente creato tramite il metodo createUserProfile di JsonComposer.
 *
 *@param req - Oggetto contenente i parametri e le informazioni della richiesta HTTP del Client.
 *@param res - Oggetto duale a req su cui invocare i metodi per inviare informazioni al Client richiedente.
 */
exports.sendUserProfile = function(req, res) {
	//prendo l'id dell'user
	var user_id = req.session.passport.user._id;
	//chiamo getUserProfile di retriever per farmi restituire i dati dell'utente
	retriever.getUserProfile(user_id, function(user){
		//invio i dati al client dopo averli "impacchettati" con il JSonComposer
		res.send(JSonComposer.createUserProfile(user));
	});
};

//req.session.passport.user        contiene _id, email, password, level

/**
 * Richiama il metodo getUserProfile di DataRetrieverUsers per ottenere
 *l'oggetto utente sulla base dei parametri inviati da req. Successivamente invia a res
 *il JSON dell'utente creato tramite il metodo createUserProfileEdit di JsonComposer.
 *
 *@param req - Oggetto contenente i parametri e le informazioni della richiesta HTTP del Client.
 *@param res - Oggetto duale a req su cui invocare i metodi per inviare informazioni al Client richiedente.
 */
exports.sendUserProfileEdit = function(req, res) {
	//prendo l'id dell'user
	var user_id = req.session.passport.user._id;
	console.log(JSON.stringify(req.session.passport.user));
	//chiamo getUserProfile di retriever per farmi restituire i dati del profilo da modificare
	retriever.getUserProfile(user_id, function(user){
		//invio i dati al client dopo averli "impacchettati" con il JSonComposer
		res.send(JSonComposer.createUserProfileEdit(user));
	});		
};

/**
 * Richiama il metodo updateUserProfile di DataRetrieverUsers passando come
 *parametro il richiedente req del Client. Ritorna al Client un codice http 200 in caso di riuscita, un codice 400 altrimenti.
 *
 *@param req - Oggetto contenente i parametri e le informazioni della richiesta HTTP del Client.
 *@param res - Oggetto duale a req su cui invocare i metodi per inviare informazioni al Client richiedente.
 */
exports.updateUserProfile = function(req, res) {

	//stampo sulla console un messaggio di aggiornamento dati
	console.log('update profile: ' + JSON.stringify(req.body));
	//chiamo updateUserProfile del retriever per effettuare l'aggiornamento dei dati del profilo
	retriever.updateUserProfile(req, function(done){
		//controllo se l'aggiornamento Ë andato a buon fine
		if(done)
		{
			//se l'aggiornamento Ë andato a buon fine allora invio uno stato HTTP 200 di successo al client
			res.send(200);
		}else{
			//se l'aggiornamento non Ë andato a buon fine allora invio uno stato HTTP 400 di insuccesso al client
			res.send(400);
		}
	});	
};

/**
 * Richiama il metodo getUsersList di DataRetrieverUsers utilizzando i parametri
 * di visualizzazione di req o assegnando dei valori di default. Ottenuti i dati,
 *risponde a res inviando il risultato della chiamata del metodo createUsersList di JsonComposer.
 *
 *@param req - Oggetto contenente i parametri e le informazioni della richiesta HTTP del Client.
 *@param res - Oggetto duale a req su cui invocare i metodi per inviare informazioni al Client richiedente.
 */
exports.getUsersList = function(req, res) {
	//stampo sulla console un messaggio di richiesta utenti registrati
	console.log('get user list: ' + JSON.stringify(req.query));	
	
	//imposto i vari parametri con valori di default se non presenti
	var page = req.query.page || 0;
	var column = req.query.column || '_id';
	//imposto un'ordinamento di default
	var order = req.query.order || 'asc';
	//prendo il numero di document per pagina dal file di configurazione, oppure se non Ë presente imposto il valore 22
	var perpage = req.config.adminConfig.usersPerPage || 22;
	
	//chiamo getUserList del retriever per farmi restituire i dati profilo degli utenti
	retriever.getUsersList(column, order, page, perpage, function(users){
		//invio la lista al client dopo averla "impacchettata" con il JSonComposer
		res.send(JSonComposer.createUsersList(users.data, users.options));
	});		
};

/**
 * Richiama il metodo getUserProfile di DataRetrieverUsers passando come parametro
 * il campo user id di req. Risponde a res inviando il risultato della chiamata del metodo createUser di JsonComposer.
 *
 *@param req - Oggetto contenente i parametri e le informazioni della richiesta HTTP del Client.
 *@param res - Oggetto duale a req su cui invocare i metodi per inviare informazioni al Client richiedente.
 */
exports.sendUser = function(req, res) {
	//stampo un messaggio sulla console per richiedere i dati utente
	console.log('getUserAdmin: ' + JSON.stringify(req.params));
	//prendo l'id dell'utente
	var user_id = req.params.user_id;
	//chiamo getUserProfile del retriever per farmi restituire i dati del profilo dell'utente
	retriever.getUserProfile(user_id, function(user){
		//invio i dati al client dopo averli "impacchettati" con il JSonComposer
		res.send(JSonComposer.createUser(user));
	});		
};

/**
 * Richiama il metodo getUserProfile di DataRetrieverUsers passando come parametro il campo user id di req.
 *Risponde a res inviando il risultato della chiamata del metodo createUser di JsonComposer.
 *
 *@param req - Oggetto contenente i parametri e le informazioni della richiesta HTTP del Client.
 *@param res - Oggetto duale a req su cui invocare i metodi per inviare informazioni al Client richiedente.
 */
exports.sendUserEdit = function(req, res) {
	//stampo sulla console un messaggio di modifica utente
	console.log('getUserEditAdmin: ' + JSON.stringify(req.params));
	//prendo l'id del document da modificare
	var user_id = req.params.user_id;
	//chiamo getUserProfile del retriever per farmi restituire i dati del profilo da modificare
	retriever.getUserProfile(user_id, function(user){
		//invio i dati al client
		res.send(JSonComposer.createUser(user));
	});	
};

/**
 * Richiama il metodo updateUser di @DataRetrieverUsers passando come parametro il richiedente req. 
 *Ritorna al Client un codice http 200 in caso di riuscita, un codice 400 altrimenti.
 *
 *@param req - Oggetto contenente i parametri e le informazioni della richiesta HTTP del Client.
 *@param res - Oggetto duale a req su cui invocare i metodi per inviare informazioni al Client richiedente.
 */
exports.updateUser = function(req, res) {
	//controllo chi si bisogna modificare
	retriever.getUserProfile(req.params.user_id, function(user2modify){
	
		//evito la modifica di un rootAdmin da parte di un admin
		if((req.session.passport.user.level < 2 &&	//se non sono rootAdmin
		   user2modify.level > 0 ) ||				//e voglio modificare un admin o peggio un rootAdmin, oppure
		   (req.session.passport.user.level < 2 &&	//se non sono rootAdmin
			req.body.level == 'root' )				//e voglio generare un rootAdmin
		)
		{
			res.send(400);							//segnalo un errore
		}else{
			//stampo sulla console un messaggio di aggiornamento dati utente
			console.log('update user from admin: ' + JSON.stringify(req.body));
			//chiamo updateUser del retriever per completare l'aggiornamento dei dati del profilo
			retriever.updateUser(req, function(done){
				//controllo se l'aggiornamento di dati Ë andato a buon fine
				if(done)
				{
					//se l'aggiornamento di dati Ë andato a buon fine allora invio al client uno stato HTTP 200 di successo
					res.send(200);
				}else{
					//se l'aggiornamento di dati non Ë andato a buon fine allora invio al client uno stato HTTP 400 di insuccesso
					res.send(400);
				}
			});	
		}
		
	});
};

/**
 * Richiama il metodo removeUser di @DataRetrieverUsers passando come parametro il campo email del richiedente req. 
 *Ritorna al Client un codice http 200 in caso di riuscita, un codice 400 altrimenti.
 *
 *@param req - Oggetto contenente i parametri e le informazioni della richiesta HTTP del Client.
 *@param res - Oggetto duale a req su cui invocare i metodi per inviare informazioni al Client richiedente.
 */
exports.removeUser = function(req, res) {

	//controllo chi si bisogna rimuovere
	retriever.getUserProfile(req.params.user_id, function(user2remove){
	
		//evito la rimozione di un rootAdmin da parte di un admin
		if(req.session.passport.user.level < 2 &&	//se non sono rootAdmin
		   user2remove.level > 0					//e voglio cancellare un admin o peggio un rootAdmin
		)
		{
			res.send(400);							//segnalo un errore
		}else{
			//stampo sulla console un messaggio di rimozione utente
			console.log('admin is removing an user: ' + req.params.user_id);
			//chiamo removeUser del retriever per eliminare un utente
			retriever.removeUser(req.params.user_id, function(done){
				//controllo se la rimozione Ë andata a buon fine
				if(done)
				{
					//se la rimozione Ë andata a buon fine allora invio uno stato HTTP 200 di successo al client
					res.send(200);
				}else{
					//se la rimozione non Ë andata a buon fine allora invio uno stato HTTP 400 di insuccesso al client
					res.send(400);
				}
			});	
		}
	});
};
