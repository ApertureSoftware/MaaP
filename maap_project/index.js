/**
 * File: index.js
 * Module: maap_project
 * Author: Alberto Garbui
 * Created: 15/05/14
 * Version: 0.1
 * Description: avvio del progetto
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
'use strict';

var maaperture = require('maaperture');
var configManager = require('./configManager');
var config = configManager.getConfig();

maaperture.start(config);
