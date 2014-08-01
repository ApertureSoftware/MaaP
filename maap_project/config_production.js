exports.app = app = {
	env: 'production',
		
	title: 'Maaperture',
	description: 'created with Maaperture - MongoDB as an Admin Platform - Aperture Software',
	
	host: 'localhost',
	port: 9000,
	
	//abilitazione connessione sicura https
	ssl: false,
	ssl_key: __dirname + '/ssl/maaperture.key',
	ssl_cert: __dirname + '/ssl/maaperture.cert',
		
	//configurazione servizio mail per recupero password
	nodemailerConfig : {
		service: "Gmail",
		user: "user@gmail.com",
		pass: "gmailpassword"
	},
	
	//abilita/disabilita registrazione utente
	enableUserRegistration: true,
	
	//crypto key for users passwords SHA1
	cryptoKey: 'm44pertureUsersP4ssw0rdK3y'
	
}

exports.adminConfig = {
	usersPerPage: 20,
	queriesPerPage: 20,
	queriesToShow: 100,
	indexesPerPage: 20,
	
	//abilita/disabilita creazione indici nel db di analisi
	enableIndexCreation: true
	
}

exports.session = {
	secret: 'boomShakalaka!YO',
	max_age: 3600000 // one hour (60s * 60m * 1000ms)
}

exports.userDB = {
	host: 'localhost',
	port: 27017,
	username: '',
	password: '',
	db_name: 'utenti',
	usersCollection: 'users',
	queryCollection: 'query'
}

exports.dataDB = {
	host: 'localhost',
	port: 27017,
	username: '',
	password: '',
	db_name: 'dati'
}

exports.static_assets = {
	dir: __dirname + '/app',
	views: __dirname + '/views',
	dsl: __dirname + '/dsl'
}
