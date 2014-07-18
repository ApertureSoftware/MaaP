/**
 * File: DataRetrieverAnalysis.test.js
 * Module: test::modelServer::dataManager::DatabaseAnalysisManager
 * Author: Fabio Miotto
 * Created: 20/06/14
 * Version: 1.0.0
 * Description: test del DataRetrieverAnalysis 
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 1.0 File creation
 ==============================================
 */

var chai = require('chai');
var should = chai.should();
var assert = chai.assert;
var expect = chai.expect;
var spies = require('chai-spies');
var rewire = require('rewire');
chai.use(spies);

var retriever = rewire("../../../../maap_server/modelServer/dataManager/DatabaseAnalysisManager/DataRetrieverAnalysis.js");

describe("DataRetrieverAnalysis Unit Test: ", function() {

	describe("getModel", function() {
			
		it("deve ritornare -1 se l'array di modelli e' vuoto", function() {
			
			var array = [];
			retriever.__set__('DB', {model: array} );
			
			var model = retriever.getModel('col1');
			
			expect(model).to.equal(-1);
					
		});
		
		it("deve ritornare -1 se la collection specificata non e' presente nell'array dei modelli", function() {
			
			var array = [
				{
					name: 'col1',
					model: 'modelCol1'
				},
				{
					name: 'col2',
					model: 'modelCol2'
				}
			];
			retriever.__set__('DB', {model: array} );
			
			var model = retriever.getModel('col3');
			
			expect(model).to.equal(-1);
					
		});
		
		it("deve ritornare il modello della collection specificata", function() {
			
			var array = [
				{
					name: 'col1',
					model: 'modelCol1'
				},
				{
					name: 'col2',
					model: 'modelCol2'
				}
			];
			retriever.__set__('DB', {model: array} );
			
			var model = retriever.getModel('col1');
			
			expect(model).to.equal('modelCol1');
					
		});
				
	});

	describe("getDocuments", function() {

		var queryResult = [];
		
		var model = {find: function(where, select, options){return {populate: function(obj){}, lean: function(){return {exec: function(callback){callback(err, queryResult);}}} } } };
		
		var querySettings = {};
		querySettings.where = {}; 
		querySettings.select = {};
		querySettings.orderbycolumn = '';
		querySettings.typeorder = 'asc';
		querySettings.startskip = 0;
		
		var populate = {};
		
		retriever.__set__('indexManager', {addQuery: function(){} } );
		
		
	});
	
	describe("getCollectionsList", function() {
	
		var collectionsList = [
			{label: 'pippo'},
			{label: 'pluto'},
			{label: 'test'}
		];
		retriever.__set__('getCollectionsListFile', function(){return collectionsList;} );
		
		it("deve ritornare la lista completa se il campo find e' undefined", function() {

			var result = retriever.getCollectionsList();
			expect(result.length).to.equal(3);
			expect(result[0].label).to.equal('pippo');
			expect(result[1].label).to.equal('pluto');
			expect(result[2].label).to.equal('test');
			
		});
		
		it("deve ritornare la lista completa se il campo find e' vuoto", function() {

			var result = retriever.getCollectionsList('');
			expect(result.length).to.equal(3);
			expect(result[0].label).to.equal('pippo');
			expect(result[1].label).to.equal('pluto');
			expect(result[2].label).to.equal('test');
			
		});
		
		it("deve ritornare la lista personalizzara con labels che contengono la stringa definita su find", function() {

			var result = retriever.getCollectionsList('p');
			expect(result.length).to.equal(2);
			expect(result[0].label).to.equal('pippo');
			expect(result[1].label).to.equal('pluto');
				
		});
		
		it("deve ritornare la lista personalizzara con labels che contengono la stringa definita su find 2", function() {

			var result = retriever.getCollectionsList('plu');
			expect(result.length).to.equal(1);
			expect(result[0].label).to.equal('pluto');
				
		});
		
	});

	describe("getTransformationFile", function() {
	
	});
	
	describe("applyTrasformations", function() {
	
		var testTransformation = {transformation: function(string){
			return string.toUpperCase();
		}};
		
		retriever.__set__('getTransformationFile',  function(collection_name, type, fieldName){ return testTransformation;} );
		
		var collection_name = ''
		var type = '';
		var documentsArray = [
			{
				id: 'id',
				test: 'test',
				unknow: 'cc'
			},
			{
				id: 'ida',
				test: 'testa',
				unknow: 'aa'
			}
		];
		var dslArray = [
			{
				transformation: '',
				name: 'id'
			},
			{
				transformation: '',
				name: 'test'
			}
		];
		
		var result = retriever.applyTransformations(collection_name, type, documentsArray, dslArray);
			
		it("deve ritornare l'array di documents con la stessa lunghezza dell'array in ingresso", function() {
			expect(result.length).to.equal(2);
		});
		
		it("deve ritornare l'array di documents modificando i campi che hanno trasformazioni", function() {
			expect(result[0].id).to.equal('ID');
			expect(result[0].test).to.equal('TEST');
			expect(result[1].id).to.equal('IDA');
			expect(result[1].test).to.equal('TESTA');
		});
		
		it("deve ritornare l'array di documents senza modificare i campi che non hanno trasformazioni", function() {
			expect(result[1].unknow).to.equal('aa');
			expect(result[0].unknow).to.equal('cc');
		});
	});

	describe("sortDocumentsByLabels", function() {
	
		var documents = new Array();
		documents.push({label:'a', name:'aa', position:1});
		documents.push({label:'b', name:'bb', position:2});
		documents.push({label:'c',name:'cc', position:3});
		
		var keys = new Array();
		keys.push(['label']);
		keys.push(['name']);
		
		var resultDocuments = new Array();
		resultDocuments.push({label: 'a', name: 'aa'});
		resultDocuments.push({label: 'b', name: 'bb'});
		resultDocuments.push({label: 'c', name: 'cc'});
		
		var documentsReturn = retriever.sortDocumentsByLabels(documents,keys);
		
		it("valore del primo campo label sbagliato", function() {
			expect(documentsReturn[0].label).to.equal(resultDocuments[0].label);
		});
		
		it("valore del primo campo name sbagliato", function() {
			expect(documentsReturn[0].name).to.equal(resultDocuments[0].name);
		});
		
		it("valore del secondo campo label sbagliato", function() {
			expect(documentsReturn[1].label).to.equal(resultDocuments[1].label);
		});
		
		it("valore del secondo campo name sbagliato", function() {
			expect(documentsReturn[1].name).to.equal(resultDocuments[1].name);
		});
		
		it("valore del terzo campo label sbagliato", function() {
			expect(documentsReturn[2].label).to.equal(resultDocuments[2].label);
		});
		
		it("valore del terzo campo name sbagliato", function() {
			expect(documentsReturn[2].name).to.equal(resultDocuments[2].name);
		});
		
	});

	describe("countDocuments", function() {
	
	});
	
	describe("findDocuments", function() {
	
	});
	
	describe("getDocumentsForIndex", function() {
	
	});
	
	describe("getCollectionIndex", function() {
	
	});

	describe("getDocumentShow", function() {
	
	});

	describe("getDocumentShowEdit", function() {
	
		
		it("deve invocare getDocuments con il model corretto", function() {
			
			var getModel = function(collection_name){
				return collection_name;
			};		
			
			var getDocuments = function(model, querySettings, populate, callback){
				callback([model]);		
			};
			
			retriever.__set__('getModel', getModel );
			retriever.__set__('getDocuments', getDocuments );
			
			retriever.getDocumentShowEdit('name', 'docID', function(doc){
				expect(doc).to.equal('name');
			});
			
		});
		
		it("deve invocare getDocuments con il campo populate vuoto", function() {
			
			var getModel = function(collection_name){
				return collection_name;
			};		
			
			var getDocuments = function(model, querySettings, populate, callback){
				callback([populate]);		
			};
			
			retriever.__set__('getModel', getModel );
			retriever.__set__('getDocuments', getDocuments );
			
			retriever.getDocumentShowEdit('name', 'docID', function(doc){
				expect(doc).to.equal('');
			});
			
		});
		
		it("deve invocare getDocuments con il querySettings corretto", function() {
			
			var getModel = function(collection_name){
				return {update: function(criteria, data, options){return {lean: function(){return {exec: function(callback){callback(true, 0);}};}}; }}
			};		
			
			var getDocuments = function(model, querySettings, populate, callback){
				callback([querySettings]);		
			};
			
			retriever.__set__('getModel', getModel );
			retriever.__set__('getDocuments', getDocuments );
			
			retriever.getDocumentShowEdit('name', 'docID', function(doc){
				expect(doc.where._id).to.equal('docID');
				expect(doc.select.field).to.equal(undefined);
				expect(doc.orderbycolumn).to.equal('');
				expect(doc.typeorder).to.equal('');
				expect(doc.startskip).to.equal(0);
				expect(doc.numberofrow).to.equal('');
			});
			
		});
		
		it("deve invocare getDocuments", function() {
			
			var getModel = function(collection_name){
				return collection_name;
			};		
			
			var getDocuments = function(model, querySettings, populate, callback){
				callback([model]);		
			};
			
			var spy = chai.spy(getDocuments);
						
			retriever.__set__('getModel', getModel );
			retriever.__set__('getDocuments', spy );
			
			retriever.getDocumentShowEdit('name', 'docID', function(doc){
				
			});
			
			expect(spy).to.have.been.called();
			
		});
		
	});

	describe("updateDocument", function() {	
		
		it("deve ritornare false se c'e' un errore nell'aggiornamento del document", function() {

			var collection_name = 'collName';
			var document_id = 'docID';
			var newDocumentData = {_id: 'docID'};
			
			var getModel = function(collection_name){
				return {update: function(criteria, data, options){return {lean: function(){return {exec: function(callback){callback(true, 0);}};}}; }}
			};		
			retriever.__set__('getModel', getModel );
					
			retriever.updateDocument(collection_name, document_id, newDocumentData, function(result){
				expect(result).to.equal(false);			
			});
			
		});
		
		it("deve ritornare false se il document da aggiornare non e' presente nel DB", function() {

			var collection_name = 'collName';
			var document_id = 'docID';
			var newDocumentData = {_id: 'docID'};
			
			var getModel = function(collection_name){
				return {update: function(criteria, data, options){return {lean: function(){return {exec: function(callback){callback(false, 0);}};}}; }}
			};		
			retriever.__set__('getModel', getModel );
					
			retriever.updateDocument(collection_name, document_id, newDocumentData, function(result){
				expect(result).to.equal(false);			
			});
			
		});
		
		it("deve ritornare true se l'aggiornamento del document ha successo", function() {

			var collection_name = 'collName';
			var document_id = 'docID';
			var newDocumentData = {_id: 'docID'};
			
			var getModel = function(collection_name){
				return {update: function(criteria, data, options){return {lean: function(){return {exec: function(callback){callback(false, 1);}};}}; }}
			};		
			retriever.__set__('getModel', getModel );
					
			retriever.updateDocument(collection_name, document_id, newDocumentData, function(result){
				expect(result).to.equal(true);			
			});
			
		});
		
		it("deve richiamare removeDocument se l'utente vuole modificare l'ID e ritornare false se c'e' un errore nella creazione del nuovo document", function() {

			var removeDoc = function(collection_name, document_id, callback){callback(true);};			
			var spy = chai.spy(removeDoc);
			retriever.__set__('removeDocument', spy);
		
			var collection_name = 'collName';
			var document_id = 'docID_2';
			var newDocumentData = {_id: 'docID'};
			
			var getModel = function(collection_name){
				return {create: function(data, callback){callback(true);}, update: function(criteria, data, options){return {lean: function(){return {exec: function(callback){callback(true, 0);}};}}; }}
			};		
			retriever.__set__('getModel', getModel );
					
			retriever.updateDocument(collection_name, document_id, newDocumentData, function(result){
				expect(result).to.equal(false);			
			});
			
			expect(spy).to.have.been.called();
			
		});
		
		it("deve richiamare removeDocument se l'utente vuole modificare l'ID e ritornare false se c'e' un errore nella rimozione del document", function() {

			var removeDoc = function(collection_name, document_id, callback){callback(false);};			
			var spy = chai.spy(removeDoc);
			retriever.__set__('removeDocument', spy);
		
			var collection_name = 'collName';
			var document_id = 'docID_2';
			var newDocumentData = {_id: 'docID'};
			
			var getModel = function(collection_name){
				return {create: function(data, callback){callback(true);}, update: function(criteria, data, options){return {lean: function(){return {exec: function(callback){callback(true, 0);}};}}; }}
			};		
			retriever.__set__('getModel', getModel );
					
			retriever.updateDocument(collection_name, document_id, newDocumentData, function(result){
				expect(result).to.equal(false);			
			});
			
			expect(spy).to.have.been.called();
			
		});
		
		it("deve richiamare removeDocument se l'utente vuole modificare l'ID e ritornare true se la creazione del nuovo document avviene correttamente", function() {

			var removeDoc = function(collection_name, document_id, callback){callback(true);};			
			var spy = chai.spy(removeDoc);
			retriever.__set__('removeDocument', spy);
		
			var collection_name = 'collName';
			var document_id = 'docID_2';
			var newDocumentData = {_id: 'docID'};
			
			var getModel = function(collection_name){
				return {create: function(data, callback){callback(false);}, update: function(criteria, data, options){return {lean: function(){return {exec: function(callback){callback(true, 0);}};}}; }}
			};		
			retriever.__set__('getModel', getModel );
					
			retriever.updateDocument(collection_name, document_id, newDocumentData, function(result){
				expect(result).to.equal(true);			
			});
			
			expect(spy).to.have.been.called();
			
		});
		
		
		
	});

	describe("removeDocument", function() {
		
		it("deve ritornare false se c'e' un errore nell'eliminazione del document", function() {

			var collection_name = 'collName';
			var document_id = 'docID';
			
			var getModel = function(collection_name){
				return {remove: function(criteria){return {lean: function(){return {exec: function(callback){callback(true, 0);}};}}; }}
			};		
			retriever.__set__('getModel', getModel );
			
			retriever.removeDocument(collection_name, document_id, function(result){
				expect(result).to.equal(false);			
			});
			
		});
		
		it("deve ritornare false se il document da cancellare non e' presente nel DB", function() {

			var collection_name = 'collName';
			var document_id = 'docID';
			
			var getModel = function(collection_name){
				return {remove: function(criteria){return {lean: function(){return {exec: function(callback){callback(false, 0);}};}}; }}
			};		
			retriever.__set__('getModel', getModel );
			
			retriever.removeDocument(collection_name, document_id, function(result){
				expect(result).to.equal(false);			
			});
			
		});
		
		it("deve ritornare true se la rimozione del document avviene con successo", function() {

			var collection_name = 'collName';
			var document_id = 'docID';
			
			var getModel = function(collection_name){
				return {remove: function(criteria){return {lean: function(){return {exec: function(callback){callback(false, 1);}};}}; }}
			};		
			retriever.__set__('getModel', getModel );
			
			retriever.removeDocument(collection_name, document_id, function(result){
				expect(result).to.equal(true);			
			});
			
		});

	});

}); //end DataRetrieverAnalysis Unit Test
