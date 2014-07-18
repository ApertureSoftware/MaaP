/**
 * File: schemaGenerator.js
 * Module: maap_server::modelServer::DSL
 * Author: Andrea Perin
 * Created: 01/06/14
 * Version: 1.0.0
 * Description: generatore di schemi per mongoose
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
'use strict';
var fs = require('fs'); 

var getPopulatedCollection = function(populateArray, key) {

	for(var i=0; i<populateArray.length; i++) 
	{
		if(populateArray[i].key == key)
			return populateArray[i].collection;
	}
	return '';
}
//for unit test
exports.getPopulatedCollection = getPopulatedCollection;

var arrayAddElement = function(element, array) {
	var trovato = false;
	for(var i=0; i<array.length; i++)
	{
		if(array[i].key == element.key)
			trovato = true;
	}
	if(!trovato)
	{
		array.push(element);
	}
	return array;
}
//for unit test
exports.arrayAddElement = arrayAddElement;

var generate = function(config, dslJson) {
	
	var fileSaved = false;
		
	var collection = dslJson.collection;
	
	//creo un array con coppie chiave/valore , scorro il DSL per trovare tutti i campi necessari
	var schemaElements = [];
	
	var indexColumns = collection.index.column;
		
	if(indexColumns != undefined)
	{
		
		for(var i=0; i<indexColumns.length; i++)
		{
			var name = indexColumns[i].name.split('.');
			var type = indexColumns[i].type;
			
			if(name.length > 1 && collection.index.populate != undefined)	//nome composto con populate
			{	
				//ora però devo aggiungere/creare lo schema del nome composto
				var composed_name = name[1];
				var composed_type = indexColumns[i].type;
				var composed_collection = getPopulatedCollection(collection.index.populate, name[0]);
				
				type = 'ObjectId, ref: \'' + composed_collection + '\'';
				
				try{
					//controllo se è gia presente un file schema per quella collection
					var composed_schema = require('./collectionData/' + composed_collection + '_schema.js');
				}catch(err){
					//console.log('missing ' + composed_collection + '_schema.js');
					//lo schema NON è stato definito, quindi lo creo exnovo
					//genero lo schema
					var filePath = config.static_assets.dsl + '/' + composed_collection + '.maap';
     				try{
						var DSL = require(filePath);
						var schema = generate(config, DSL);
					}catch(err){
						//schema vuoto se non e' scritto un dsl
						var schema = generate(config, {collection:{name: composed_collection,index:{},show:{}}} );
					}
					var saveFile = __dirname + '/collectionData/' + composed_collection + '_schema.js';
					if(config.app.env == 'development')
						console.log('saving ' + composed_collection + '_schema.js');
					
					fileSaved = false;
					fs.writeFile(saveFile, schema, 'utf-8', function (err) {
							if (err) {
								console.error('error writing schema file: ' + saveFile);
								throw err;
							} else {
								console.log(composed_collection + '_schema.js saved!');
								fileSaved = true;
							}
						}
					);	
					while(!fileSaved){require('deasync').sleep(100);}
					
				}
			}	
			
			schemaElements = arrayAddElement({key: name[0], value: type}, schemaElements);
			
		}//end for indexColumns
	}
	
	
	var showRows = collection.show.row;
	
	if(showRows != undefined)
	{
		
		for(var i=0; i<showRows.length; i++)
		{
			var name = showRows[i].name.split('.');
			var type = showRows[i].type;
			
			if(name.length > 1 &&  collection.show.populate != undefined)	//nome composto con populate
			{				
				//ora però devo aggiungere/creare lo schema del nome composto
				var composed_name = name[1];
				var composed_type = showRows[i].type;
				var composed_collection = getPopulatedCollection(collection.show.populate, name[0]);
				
				type = 'ObjectId, ref: \'' + composed_collection + '\'';
				
				//controllo se è gia presente un file schema per quella collection
				try{
					var composed_schema = require('./collectionData/' + composed_collection + '_schema.js');		
				}catch(err){
					if(config.app.env == 'development')
						console.log('generator show not found ' + composed_collection + '_schema.js');
					//lo schema NON è stato definito, quindi lo creo exnovo
					var filePath = config.static_assets.dsl + '/' + composed_collection + '.maap';
					try{
						var DSL = require(filePath);
						var schema = generate(config, DSL);
					}catch(err){
						//schema vuoto se non e' scritto un dsl
						var schema = generate(config, {collection:{name: composed_collection,index:{},show:{}}} );
					}
					var saveFile = __dirname + '/collectionData/' + composed_collection + '_schema.js';
					if(config.app.env == 'development')
						console.log('saving ' + saveFile);
						
					fileSaved = false;
					fs.writeFile(saveFile, schema, 'utf-8', function (err) {
							if (err) {
								console.error('error writing schema file: ' + saveFile);
								throw err;
							} else {
								console.log(composed_collection + '_schema.js saved!');
								fileSaved = true;
							}
						}
					);
					while(!fileSaved){require('deasync').sleep(100);}
				}
			}	
			
			schemaElements = arrayAddElement({key: name[0], value: type}, schemaElements);
			
		}//end for showRows
	}
	
	//ora che schemaElements e' completo genero lo schema
	var schema = '//maaperture auto-generated mongoose schema for collection \'' + collection.name + '\'\n\n';
	schema += 'var mongoose = require(\'mongoose\');\n';	
	schema += 'var ObjectId = mongoose.Schema.ObjectId;\n\n';
	schema += 'exports.schemaName = \'' + collection.name + '\';\n\n';
	schema += 'exports.schema = new mongoose.Schema({\n';
	for(var i=0; i<schemaElements.length; i++)
	{
		if(i != 0){schema += ',\n';}
		var key = schemaElements[i].key;
		var type = schemaElements[i].value;
		schema += key + ': { type: ' + type + ' }';
	}
	schema += '\n}, { autoIndex: false, collection: \'' + collection.name + '\' });\n\n';
	
	return schema;
}

exports.generate = generate;