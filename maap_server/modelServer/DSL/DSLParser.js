/**
 * File: DSLParser.js
 * Module: maap_server::modelServer::DSL
 * Author: Michele Maso
 * Created: 22/05/14
 * Version: 1.0.0
 * Description: parser del dsl
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
'use strict';

var JSparser = require('./JavascriptParser');

var dsltoken = [
	{
		"token" : "label",
		"default" : null
	},
	{
		"token" : "position",
		"default" : -1
	},
	{
		"token" : "perpage",
		"default" : 22
	},
	{
		"token" : "sortby",
		"default" : "_id"
	},
	{
		"token" : "order",
		"default" : "asc"
	},
	{
		"token" : "column",
		"default" : null
	},
	{
		"token" : "transformation",
		"default" : null
	},
	{
		"token" : "function",
		"default" : null
	},
	{
		"token" : "query",
		"default" : null
	},
	{
		"token" : "row",
		"default" : null
	},
	{
		"token" : "populate",
		"default" : null
	}
];

var addField = function(collection, field) {   
   
	var a = collection[field];
	if(a == undefined){
		for(var i=0; i<dsltoken.length; i++){
			if(dsltoken[i].token == field){
				collection[field] = dsltoken[i].default;
			}//if
		}//for
		return false;
	}
	else{
		return true;
	}		
}
//for unit test
exports.addField = addField;

var checkFieldThrow = function(collection, field, root){ 
	var err = 'Campo obbligatorio: ' + field + ' non trovato in ' + root;
	
	if(!checkField(collection,field)) 
		throw err;
}
//for unit test
exports.checkFieldThrow = checkFieldThrow;

var checkField = function(collection, field){      
	try{
		var a = collection[field];
		if(a === undefined){
			throw field;
		}
		return true;
	}
	catch(err){
		 return false;
	}	
}
//for unit test
exports.checkField = checkField;

var checkFieldContentThrow = function(collection, field, root){ 
	var err = 'Campo obbligatorio: ' + field + ' non trovato in ' + root +  ' o vuoto';
	
	if(!checkFieldContent(collection,field)) 
	 throw err;
	 
}
//for unit test
exports.checkFieldContentThrow = checkFieldContentThrow;

var checkFieldContent = function(collection, field){ 
	try{
		var testField = collection[field];
		if(testField === undefined){
			throw field;
		}
		if(testField == ""){
			throw field;
		}
		return true;
	}
	catch(err){
		return false;
	}
}
//for unit test
exports.checkFieldContent = checkFieldContent;

var IntValue = function(value, field){
	try{
		if (isNaN(value)) {
			throw field;
		}
		return true;
	}
	catch(field){
		    console.log('Il valore [' + value + '] del campo ' + field + ' non e\' un numero');
			return false;
	}	
}//end function
//for unit test
exports.IntValue = IntValue;

var transformationArray = {};

var parseDSL = function(DSLstring) {

	transformationArray.index = [];	//fix bug, array devono essere inizializzati ad ogni richiamo della funzione parseDSL
	transformationArray.show = [];
	var functionbuttonindex=[];
	var transformationindex=[];
	var JSONresult={};
	JSONresult.collection=DSLstring.collection;
	var collection = DSLstring.collection; 
		checkFieldThrow(collection,'index','collection');
		var populate = collection.index.populate;
		var populateFind = false;
		if(populate != undefined){
			populateFind = true;
			for(var i=0;i<collection.index.populate.length;i++){
				checkFieldContentThrow(collection.index.populate[i],'collection','populate');
				checkFieldContentThrow(collection.index.populate[i],'key','populate');
			}
		}//if
	    if(checkField(collection.index,'column')){
	    var column=collection.index.column;
	    for(var i=0;i<column.length;i++){
		         checkFieldThrow(column[i],'name','column');
				 if(populateFind){
						var name = collection.index.column[i].name.split('.');
						if(name.length > 1){
							name = name[0];
							var nameSplitFind = false; 
							for(var j=0;j<collection.index.populate.length;j++){
								if(collection.index.populate[j].key == name)
									nameSplitFind = true;
							}
							if(nameSplitFind == false){
									var err = 'Campo '+name+' non presente nel populate ';
									throw err;
							}
						}
				 }
				 if(collection.index.column[i].transformation===undefined){ ;}
				else{
					var name = collection.index.column[i].name.split('.');
					if(name.length > 1){name = name[1];}
					else{name = name[0];}
					transformationindex.push('var ' + name + '; ' + collection.index.column[i].transformation);
					transformationArray['index'].push({	name: collection.index.column[i].name, 
														transformation: collection.index.column[i].transformation
													});
				 }//else
		}//for
		}
		if(checkField(collection,'position','collection')){
		
		var a=IntValue(collection.position,'position');
		//if(intvalue)
		
		}//if
		
		var button=collection.index.button;
		if(button != undefined) {
			for(var i=0;i<button.length;i++){
					 checkFieldThrow(button[i],'name','button');
					 functionbuttonindex[i]=collection.index.button[i].function;
			}
		}
		
		if(checkField(collection.index,'perpage')){
		
		var a=IntValue(collection.index.perpage,'perpage');
		//if(intvalue)
		
		}//if
		
	//check show
	var functionbuttonshow=[];
    var transformationshow=[];
	var show=DSLstring.collection;
	checkFieldThrow(collection,'show','collection');
	var button=collection.show.button;
	if(button != undefined)
	{
		for(var i=0;i<button.length;i++){
		         checkFieldThrow(button[i],'name','button');
				 functionbuttonshow.push(collection.show.button[i].function);
		}
	}
	if(checkField(collection.show,'row','show')){
	    var row=collection.show.row;
	    for(var i=0;i<row.length;i++){
		        checkFieldThrow(row[i],'name','column');
				if(collection.show.row[i].transformation===undefined){;}
				else{
				var name = collection.show.row[i].name.split('.');
				if(name.length > 1){name = name[1];}
				else{name = name[0];}
				transformationshow.push('var ' + name + '; ' + collection.show.row[i].transformation);
				transformationArray['show'].push({	name: collection.show.row[i].name, 
													transformation: collection.show.row[i].transformation
												});
				}//else
		}//for
	}
	
	var alltransformation=[];
	alltransformation=transformationshow.concat(transformationindex);
	var allfunctions=[];
	if(button != undefined)
	{
		allfunctions=functionbuttonshow.concat(functionbuttonindex);
	}
	var all=[];
	all=alltransformation.concat(allfunctions);
	
	//console.log('testing javascript trasformation...');
		
	for(var i=0;i<all.length;i++){
	//tento il parsing del file javascript
	if(all[i] == undefined)continue;
	try {
		var result = JSparser.parse(all[i]);
	} catch(err) {
		console.error('parsing error!');
		console.error('check your function syntax!');
		throw err; 
	}
	}//for
	
	addField(collection,'label');
	addField(collection,'position');
	addField(collection.index,'populate');
	addField(collection.index,'sortby');
	addField(collection.index,'order');
	addField(collection.index,'perpage');
	if(collection.index.column!=undefined){
		for(var i=0;i<collection.index.column.length;i++){
			addField(collection.index.column[i],'label');
			addField(collection.index.column[i],'transformation');
		}
	}
	addField(collection.index,'column');
	
	if(collection.index.button!=undefined){
		for(var i=0;i<collection.index.button.length;i++){
			addField(collection.index.button[i],'label');
			addField(collection.index.button[i],'function');
		}
	}
	addField(collection.index,'button');
	
	addField(collection.index,'query');

	if(collection.show.row!=undefined){
	for(var i=0;i<collection.show.row.length;i++){
	addField(collection.show.row[i],'label');
	addField(collection.show.row[i],'transformation');
	}
	}
	addField(collection.show,'row');
	
	if(collection.show.button!=undefined){
	for(var i=0;i<collection.show.button.length;i++){
	addField(collection.show.button[i],'label');
	addField(collection.show.button[i],'function');
	}
	}
	addField(collection.show,'button');

	
	
	//ritorno il JSON con tutti i campi del DSL
	return JSONresult;
}

exports.transformations = transformationArray;
exports.parseDSL = parseDSL;
