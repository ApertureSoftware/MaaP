/**
 * File: DatabaseAnalysisManager.test.js
 * Module: test::modelServer::dataManager::DatabaseAnalysisManager
 * Author: Andrea Perin
 * Created: 22/06/14
 * Version: 1.0.0
 * Description: test del DatabaseAnalysisManager
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

var manager = rewire("../../../../maap_server/modelServer/dataManager/DatabaseAnalysisManager/DatabaseAnalysisManager.js");

describe("DatabaseAnalysisManager Unit Test: ", function() {

	describe("sendCollectionsList", function() {
	
		it("deve ritornare la lista delle collections generata dal JSonComposer", function() {
			
			manager.__set__('retriever', {getCollectionsList: function(find){return 'collectionsList';} } );
			manager.__set__('JSonComposer', {createCollectionsList: function(collectionsList){return collectionsList;}} );
			
			var req = {params: {find: 'colName'}};
			
			manager.sendCollectionsList(req, {send: function(response){
				expect(response).to.equal('collectionsList');
			}});
		
		});		
					
	});
	
	describe("sendCollection", function() {
	
		it("deve rispondere con una collection in JSON prodotto dal JSonComposer con il campo labels corretto", function() {
			
			var data = {labels: 'labels', documents: 'documents', options: 'options'};
			manager.__set__('retriever', {getCollectionIndex: function(collection_name, column, order, page, callback){callback(data);}} );
			manager.__set__('JSonComposer', {createCollection: function(labels, documents, options){return labels;}} );
			
			var req = {config: {}, params: {col_id: 'colName'}, query:{column: 'column', order: 'asc', page: 0}};
			
			manager.sendCollection(req, {send: function(response){
				expect(response).to.equal('labels');
			}});
		
		});	
		
		it("deve rispondere con una collection in JSON prodotto dal JSonComposer con il campo documents corretto", function() {
			
			var data = {labels: 'labels', documents: 'documents', options: 'options'};
			manager.__set__('retriever', {getCollectionIndex: function(collection_name, column, order, page, callback){callback(data);}} );
			manager.__set__('JSonComposer', {createCollection: function(labels, documents, options){return documents;}} );
			
			var req = {config: {}, params: {col_id: 'colName'}, query:{column: 'column', order: 'asc', page: 0}};
			
			manager.sendCollection(req, {send: function(response){
				expect(response).to.equal('documents');
			}});
		
		});	
		
		it("deve rispondere con una collection in JSON prodotto dal JSonComposer con il campo options corretto", function() {
			
			var data = {labels: 'labels', documents: 'documents', options: 'options'};
			manager.__set__('retriever', {getCollectionIndex: function(collection_name, column, order, page, callback){callback(data);}} );
			manager.__set__('JSonComposer', {createCollection: function(labels, documents, options){return options;}} );
			
			var req = {config: {}, params: {col_id: 'colName'}, query:{column: 'column', order: 'asc', page: 0}};
			
			manager.sendCollection(req, {send: function(response){
				expect(response).to.equal('options');
			}});
		
		});	
		
		it("deve essere usato il nome della collection presente nella request", function() {
			
			manager.__set__('retriever', {getCollectionIndex: function(collection_name, column, order, page, callback){var data = {labels: collection_name, documents: 'documents', options: 'options'}; callback(data);}} );
			manager.__set__('JSonComposer', {createCollection: function(labels, documents, options){return labels;}} );
			
			var req = {config: {}, params: {col_id: 'colName'}, query:{column: 'column', order: 'asc', page: 0}};
			
			manager.sendCollection(req, {send: function(response){
				expect(response).to.equal('colName');
			}});
		
		});	
		
		it("deve essere usata la colonna da ordinare presente nella request", function() {
			
			manager.__set__('retriever', {getCollectionIndex: function(collection_name, column, order, page, callback){var data = {labels: column, documents: 'documents', options: 'options'}; callback(data);}} );
			manager.__set__('JSonComposer', {createCollection: function(labels, documents, options){return labels;}} );
			
			var req = {config: {}, params: {col_id: 'colName'}, query:{column: 'column', order: 'asc', page: 0}};
			
			manager.sendCollection(req, {send: function(response){
				expect(response).to.equal('column');
			}});
		
		});	
		
		it("deve essere usato ordine per l'ordinamento presente nella request", function() {
			
			manager.__set__('retriever', {getCollectionIndex: function(collection_name, column, order, page, callback){var data = {labels: order, documents: 'documents', options: 'options'}; callback(data);}} );
			manager.__set__('JSonComposer', {createCollection: function(labels, documents, options){return labels;}} );
			
			var req = {config: {}, params: {col_id: 'colName'}, query:{column: 'column', order: 'asc', page: 0}};
			
			manager.sendCollection(req, {send: function(response){
				expect(response).to.equal('asc');
			}});
		
		});	
		
		it("deve essere usata la pagina indicata nella request", function() {
			
			manager.__set__('retriever', {getCollectionIndex: function(collection_name, column, order, page, callback){var data = {labels: page, documents: 'documents', options: 'options'}; callback(data);}} );
			manager.__set__('JSonComposer', {createCollection: function(labels, documents, options){return labels;}} );
			
			var req = {config: {}, params: {col_id: 'colName'}, query:{column: 'column', order: 'asc', page: 22}};
			
			manager.sendCollection(req, {send: function(response){
				expect(response).to.equal(22);
			}});
		
		});	

		
		it("deve rispondere con codice 404 se il campo documents e' indefinito", function() {
			
			var data = {labels: 'labels', options: 'options'};
			manager.__set__('retriever', {getCollectionIndex: function(collection_name, column, order, page, callback){callback(-1);}} );
		
			var req = {config: {}, params: {col_id: 'colName'}, query:{column: 'column', order: 'asc', page: 0}};
						
			manager.sendCollection(req, {send: function(responseCode){
				expect(responseCode).to.equal(404);
			}});
		
		});	
					
	});
	
	describe("sendDocument", function() {
	
		it("deve rispondere con document in JSON prodotto dal JSonComposer con il campo labels corretto", function() {
			
			var data = {labels: 'labels', rows: 'rows', options: 'options'};
			manager.__set__('retriever', {getDocumentShow: function(collection_name, document_id, callback){callback(data);}} );
			manager.__set__('JSonComposer', {createDocument: function(labels, rows){return labels;}} );
			
			var req = {body:{}, config: {}, params: {col_id: 0, doc_id: 0}};
			
			manager.sendDocument(req, {send: function(response){
				expect(response).to.equal('labels');
			}});
		
		});	

		it("deve rispondere con document in JSON prodotto dal JSonComposer con il campo rows corretto", function() {
			
			var data = {labels: 'labels', rows: 'rows', options: 'options'};
			manager.__set__('retriever', {getDocumentShow: function(collection_name, document_id, callback){callback(data);}} );
			manager.__set__('JSonComposer', {createDocument: function(labels, rows){return rows;}} );
			
			var req = {body:{}, config: {}, params: {col_id: 0, doc_id: 0}};
			
			manager.sendDocument(req, {send: function(response){
				expect(response).to.equal('rows');
			}});
		
		});		
		
		it("deve rispondere con codice 404 se il campo rows e' indefinito", function() {
			
			var data = {labels: 'labels', options: 'options'};
			manager.__set__('retriever', {getDocumentShow: function(collection_name, document_id, callback){callback(data);}} );
			
			var req = {body:{}, config: {}, params: {col_id: 0, doc_id: 0}};
			
			manager.sendDocument(req, {send: function(responseCode){
				expect(responseCode).to.equal(404);
			}});
		
		});	
		
		it("deve usare il nome della collection presente nella request", function() {
			
			manager.__set__('retriever', {getDocumentShow: function(collection_name, document_id, callback){var data = {labels: collection_name, rows: 'rows', options: 'options'}; callback(data);}} );
			manager.__set__('JSonComposer', {createDocument: function(labels, rows){return labels;}} );
			
			var req = {body:{}, config: {}, params: {col_id: 'colName', doc_id: 'docName'}};
			
			manager.sendDocument(req, {send: function(response){
				expect(response).to.equal('colName');
			}});
		
		});	
		
		it("deve usare il nome del document presente nella request", function() {
			
			manager.__set__('retriever', {getDocumentShow: function(collection_name, document_id, callback){var data = {labels: document_id, rows: 'rows', options: 'options'}; callback(data);}} );
			manager.__set__('JSonComposer', {createDocument: function(labels, rows){return labels;}} );
			
			var req = {body:{}, config: {}, params: {col_id: 'colName', doc_id: 'docName'}};
			
			manager.sendDocument(req, {send: function(response){
				expect(response).to.equal('docName');
			}});
		
		});		
					
	});
	
	describe("sendDocumentEdit", function() {
	
		it("deve rispondere con document in JSON prodotto dal JSonComposer", function() {
			
			var document2edit = {test: 'testField'};
			manager.__set__('retriever', {getDocumentShowEdit: function(collection_name, document_id, callback){callback(document2edit);}} );
			
			var req = {body:{}, config: {}, params: {col_id: 0, doc_id: 0}};
			
			manager.sendDocumentEdit(req, {send: function(response){
				expect(response.test).to.equal('testField');
			}});
		
		});	

		it("deve usare il nome della collection presente nella request", function() {
			
			manager.__set__('retriever', {getDocumentShowEdit: function(collection_name, document_id, callback){callback(collection_name);}} );
			
			var req = {body:{}, config: {}, params: {col_id: 'colID', doc_id: 'docID'}};
			
			manager.sendDocumentEdit(req, {send: function(response){
				expect(response).to.equal('colID');
			}});
		
		});	
		
		it("deve usare il nome del document presente nella request", function() {
			
			manager.__set__('retriever', {getDocumentShowEdit: function(collection_name, document_id, callback){callback(document_id);}} );
			
			var req = {body:{}, config: {}, params: {col_id: 'colID', doc_id: 'docID'}};
			
			manager.sendDocumentEdit(req, {send: function(response){
				expect(response).to.equal('docID');
			}});
		
		});	
		
	});
	
	describe("updateDocument", function() {
	
		it("deve rispondere con un codice 200 se la rimozione del document ha successo", function() {
			
			manager.__set__('retriever', {updateDocument: function(collection_name, document_id, req_body, callback){callback(true);}} );
			
			var req = {body:{}, config: {}, params: {col_id: 0, doc_id: 0}};
			
			manager.updateDocument(req, {send: function(responseCode){
				expect(responseCode).to.equal(200);
			}});
		
		});	
		
		it("deve rispondere con un codice 401 se la rimozione del document ha successo", function() {
			
			manager.__set__('retriever', {updateDocument: function(collection_name, document_id, req_body, callback){callback(false);}} );
			
			var req = {body:{}, config: {}, params: {col_id: 0, doc_id: 0}};
			
			manager.updateDocument(req, {send: function(responseCode){
				expect(responseCode).to.equal(401);
			}});
		
		});	
					
	});
	
	describe("removeDocument", function() {
	
		it("deve rispondere con un codice 200 se la rimozione del document ha successo", function() {
			
			manager.__set__('retriever', {removeDocument: function(collection_name, document_id, callback){callback(true);}} );
			
			var req = {config: {}, params: {col_id: 0, doc_id: 0}};
			
			manager.removeDocument(req, {send: function(responseCode){
				expect(responseCode).to.equal(200);
			}});
		
		});

		it("deve rispondere con un codice 400 se la rimozione del document non ha successo", function() {
			
			manager.__set__('retriever', {removeDocument: function(collection_name, document_id, callback){callback(false);}} );
			
			var req = {config: {}, params: {col_id: 0, doc_id: 0}};
			
			manager.removeDocument(req, {send: function(responseCode){
				expect(responseCode).to.equal(400);
			}});
		
		});		
					
	});
	
	describe("resetQueries", function() {
	
		it("deve rispondere con un codice 200 se la rimozione della query ha successo", function() {
			
			manager.__set__('indexManager', {resetQueries: function(callback){callback(true);}} );
			
			var req = {};
			
			manager.resetQueries(req, {send: function(responseCode){
				expect(responseCode).to.equal(200);
			}});
		
		});

		it("deve rispondere con un codice 400 se la rimozione della query non ha successo", function() {
			
			manager.__set__('indexManager', {resetQueries: function(callback){callback(false);}} );
			
			var req = {};
			
			manager.resetQueries(req, {send: function(responseCode){
				expect(responseCode).to.equal(400);
			}});
		
		});
					
	});
	
	describe("getTopQueries", function() {
	
		it("deve ritornare la lista delle query creata dal JSonComposer", function() {
			
			var queries = {data: 'queriesList', options: {}};
			manager.__set__('indexManager', {getQueries: function(page, queriesPerPage, queries2show, callback){callback(queries);}} );
			manager.__set__('JSonComposer', {createQueriesList: function(queries, options){return queries;}} );
			
			var req = {query:{page: 0}, config: {adminConfig: {queriesPerPage: 30, queriesToShow: 30}} };
			
			manager.getTopQueries(req, {send: function(response){
				expect(response).to.equal('queriesList');
			}});
		
		});	
		
		it("deve usare il valore nella request per queriesPerPage", function() {
			
			manager.__set__('indexManager', {getQueries: function(page, queriesPerPage, queries2show, callback){var queries = {data: queriesPerPage, options: {}}; callback(queries);}} );
			manager.__set__('JSonComposer', {createQueriesList: function(queries, options){return queries;}} );
			
			var req = {query:{page: 0}, config: {adminConfig: {queriesPerPage: 33, queriesToShow: 32}} };
			
			manager.getTopQueries(req, {send: function(response){
				expect(response).to.equal(33);
			}});
		
		});	
		
		it("deve usare il valore nella request per numberOfQueries2show", function() {
			
			manager.__set__('indexManager', {getQueries: function(page, queriesPerPage, queries2show, callback){var queries = {data: queries2show, options: {}}; callback(queries);}} );
			manager.__set__('JSonComposer', {createQueriesList: function(queries, options){return queries;}} );
			
			var req = {query:{page: 0}, config: {adminConfig: {queriesPerPage: 33, queriesToShow: 32}} };
			
			manager.getTopQueries(req, {send: function(response){
				expect(response).to.equal(32);
			}});
		
		});	

		it("deve usare il valore di default per queriesPerPage", function() {
			
			
			manager.__set__('indexManager', {getQueries: function(page, queriesPerPage, queries2show, callback){var queries = {data: queriesPerPage, options: {}}; callback(queries);}} );
			manager.__set__('JSonComposer', {createQueriesList: function(queries, options){return queries;}} );
			
			var req = {query:{page: 0}, config: {adminConfig: {}} };
			
			manager.getTopQueries(req, {send: function(response){
				expect(response).to.equal(20);
			}});
		
		});

		it("deve usare il valore di default per numberOfQueries2show", function() {
			
			
			manager.__set__('indexManager', {getQueries: function(page, queriesPerPage, queries2show, callback){var queries = {data: queries2show, options: {}}; callback(queries);}} );
			manager.__set__('JSonComposer', {createQueriesList: function(queries, options){return queries;}} );
			
			var req = {query:{page: 0}, config: {adminConfig: {}} };
			
			manager.getTopQueries(req, {send: function(response){
				expect(response).to.equal(10);
			}});
		
		});		
					
	});
	
	describe("getIndexesList", function() {
		
		it("deve ritornare la lista degli indici creata dal JSonComposer", function() {
			
			var _indexes = ['index1','index2'];
			manager.__set__('indexManager', {getIndex: function(db, page, indexesPerPage, callback){callback({indexes: _indexes, options: {pages: 2}});}} );
			manager.__set__('JSonComposer', {createIndexesList: function(indexes, options){return indexes;}} );
			
			var req = {query:{page: 0}, dataDB: {}, config: {adminConfig: {indexesPerPage: 10}} };
			
			manager.getIndexesList(req, {send: function(response){
				expect(response.length).to.equal(2);
				expect(response[0]).to.equal('index1');
				expect(response[1]).to.equal('index2');
			}});
		
		});		
					
	});
	
	describe("createIndex", function() {
	
		it("deve rispondere con un codice 400 se la creazione dell'indice non ha successo", function() {
			
			manager.__set__('indexManager', {createIndex: function(query_id, index_name, callback){callback(false);}} );
			
			var req = { body: {id: 'ID', indexName: 'indexName'}};
			
			manager.createIndex(req, {send: function(responseCode){
				expect(responseCode).to.equal(400);
			}});
		
		});	
		
		it("deve rispondere con un codice 200 se la creazione dell'indice non ha successo", function() {
			
			manager.__set__('indexManager', {createIndex: function(query_id, index_name, callback){callback(true);}} );
			
			var req = { body: {id: 'ID', indexName: 'indexName'}};
			
			manager.createIndex(req, {send: function(responseCode){
				expect(responseCode).to.equal(200);
			}});
		
		});	
					
	});
	
	describe("deleteIndex", function() {
	
		it("deve rispondere con un codice 400 se la rimozione dell'indice non ha successo", function() {
			
			manager.__set__('indexManager', {deleteIndex: function(db, indexName, collectionName, callback){callback(false);}} );
			
			var req = { params: {index_name: 'indexName', col_name: 'colName'}, dataDB: {}};
			
			manager.deleteIndex(req, {send: function(responseCode){
				expect(responseCode).to.equal(400);
			}});
		
		});
		
		it("deve rispondere con un codice 200 se la rimozione dell'indice ha successo", function() {
			
			manager.__set__('indexManager', {deleteIndex: function(db, indexName, collectionName, callback){callback(true);}} );
			
			var req = { params: {index_name: 'indexName', col_name: 'colName'}, dataDB: {}};
			
			manager.deleteIndex(req, {send: function(responseCode){
				expect(responseCode).to.equal(200);
			}});
		
		});
					
	});
	
}); //end DatabaseAnalysisManager Unit Test
