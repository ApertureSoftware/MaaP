/**
 * File: index.js
 * Module: maaperture
 * Author: Alberto Garbui
 * Created: 02/05/14
 * Version: 1.0.0
 * Description: avvio del server
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
'use strict';//mostra tutti i warning possibili

/**
 *Descriprion: metodo che serve per avviare il server
 *
 */
var server = require('./maap_server');//carico il modulo del server
exports.start = server.start;//esporto lo start del server