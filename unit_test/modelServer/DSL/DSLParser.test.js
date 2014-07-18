/**
 * File: DSLParser.test.js
 * Module: test::modelServer::DSL
 * Author: Andrea Perin
 * Created: 23/06/14
 * Version: 1.0.0
 * Description: test del DSL parser
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 1.0 File creation
 ==============================================
 */
'use strict';

var chai = require('chai');
var should = chai.should();
var assert = chai.assert;
var expect = chai.expect;

var rewire = require("rewire");

var DSLParser = rewire("../../../maap_server/modelServer/DSL/DSLParser.js");

describe("DSLParser Unit Test: ", function() {

	DSLParser.__set__("dsltoken", [{
										"token" : "etichetta",
										"default" : 'defaultLabel'
									}]);

	describe("addField", function() {

		it("collection non deve essere modificata", function() {
			var collection = {etichetta: 'ciao'};
			var result = DSLParser.addField(collection, 'etichetta');
			expect(result).to.equal(true);
		}),
		
		it("collection deve essere modificata aggiungento la chiave con il campo di default", function() {
			var collection = {};
			var result = DSLParser.addField(collection, 'etichetta');
			expect(result).to.equal(false);
			expect(collection).to.have.property('etichetta');
			expect(collection.etichetta).to.equal('defaultLabel');
		});
		
	});

	describe("checkFieldThrow", function() {

		it("deve essere lanciata un'eccezione per un campo obbligatorio non trovato", function() {
			var collection = {};
			var result = function(){DSLParser.checkFieldThrow(collection, 'etichetta', 'collection'); };
			expect(result).to.Throw('Campo obbligatorio: etichetta non trovato in collection');
		});	
	});

	describe("checkField", function() {

		it("deve ritornare false se collection[field] e' indefinita", function() {
			var collection = {};
			var result = DSLParser.checkField(collection, 'etichetta'); 
			expect(result).to.equal(false);
		}),
		
		it("deve ritornare true se collection[field] e' indefinita", function() {
			var collection = {etichetta: 'label'};
			var result = DSLParser.checkField(collection, 'etichetta');
			expect(result).to.equal(true);
		});	
		
	});

	describe("checkFieldContentThrow", function() {

		it("deve essere lanciata un'eccezione per un campo obbligatorio vuoto", function() {
			var collection = {etichetta: ''};
			var result = function(){DSLParser.checkFieldContentThrow(collection, 'etichetta', 'collection'); };
			expect(result).to.Throw('Campo obbligatorio: etichetta non trovato in collection o vuoto');
		}),

		it("deve essere lanciata un'eccezione per un campo obbligatorio non definito", function() {
			var collection = {};
			var result = function(){DSLParser.checkFieldContentThrow(collection, 'etichetta', 'collection'); };
			expect(result).to.Throw('Campo obbligatorio: etichetta non trovato in collection o vuoto');
		});	
			
	});

	describe("checkFieldContent", function() {

		it("deve restituire true per un campo obbligatorio definito", function() {
			var collection = {etichetta: 'pippo'};
			var result = DSLParser.checkFieldContent(collection, 'etichetta'); 
			expect(result).to.equal(true);
		}),

		it("deve restituire false per un campo obbligatorio vuoto", function() {
			var collection = {etichetta: ''};
			var result = DSLParser.checkFieldContent(collection, 'etichetta'); 
			expect(result).to.equal(false);
		}),

		it("deve restituire false per un campo obbligatorio non definito", function() {
			var collection = {};
			var result = DSLParser.checkFieldContent(collection, 'etichetta');
			expect(result).to.equal(false);
		});	
		
	});

	describe("IntValue", function() {

		it("deve ritornare true se field e' un numero", function() {
			var field = 0;
			var result = DSLParser.IntValue(field, 'collection.position'); 
			expect(result).to.equal(true);
		}),
		
		it("deve ritornare false se field non e' un numero", function() {
			var field = 'ciao';
			var result = DSLParser.IntValue(field, 'collection.position'); 
			expect(result).to.equal(false);
		});	
		
	});
	 
	describe("parseDSL", function() {

		var DSLParser = require("../../../maap_server/modelServer/DSL/DSLParser.js");
		var DSLstring = require("./membersForDSLParser.maap");;
		var JSONresult = DSLParser.parseDSL(DSLstring);
		var collection = JSONresult.collection;
		
		it("il parser deve generare un JSON corretto per la collection", function() {
			
			expect(collection).to.have.property('label');
			expect(collection.label).to.equal('Membri');
			
			expect(collection).to.have.property('name');
			expect(collection.name).to.equal('members');
			
			expect(collection).to.have.property('position');
			expect(collection.position).to.equal(1);
			
			expect(collection).to.have.property('index');
			expect(collection).to.have.property('show');
			
			expect(collection.index).to.have.property('perpage');
			expect(collection.index.perpage).to.equal(2);
			
			expect(collection.index).to.have.property('sortby');
			expect(collection.index.sortby).to.equal('age');
			
			expect(collection.index).to.have.property('order');
			expect(collection.index.order).to.equal('asc');
			
			expect(collection.index).to.have.property('column');
			
			for(var i=0; i<2; i++)
			{
				expect(collection.index.column[i]).to.have.property('label');
				expect(collection.index.column[i]).to.have.property('name');
				expect(collection.index.column[i]).to.have.property('type');
				expect(collection.index.column[i]).to.have.property('transformation');			
			}

			expect(collection.index.column[0].label).to.equal(null);
			expect(collection.index.column[0].name).to.equal('name');
			expect(collection.index.column[0].type).to.equal('String');
			expect(collection.index.column[0].transformation).to.equal(null);
			
			expect(collection.index.column[1].label).to.equal('eta');
			expect(collection.index.column[1].name).to.equal('age');
			expect(collection.index.column[1].type).to.equal('Number, min: 18, max:35');
			expect(collection.index.column[1].transformation).to.equal(null);
			
			expect(collection.index).to.have.property('query');
			expect(collection.index.query).to.have.property('age');
			expect(collection.index.query.age).to.have.property('$lt');
			expect(collection.index.query.age.$lt).to.equal(40);
			
			expect(collection.index).to.have.property('populate');
			expect(collection.index.populate).to.equal(null);
			
			expect(collection.show).to.have.property('row');
			for(var i=0; i<2; i++)
			{
				expect(collection.show.row[i]).to.have.property('label');
				expect(collection.show.row[i]).to.have.property('name');
				expect(collection.show.row[i]).to.have.property('type');
				expect(collection.show.row[i]).to.have.property('transformation');			
			}
			
			expect(collection.show.row[0].label).to.equal('Nome');
			expect(collection.show.row[0].name).to.equal('name');
			expect(collection.show.row[0].type).to.equal('String');
			expect(collection.show.row[0].transformation).to.equal(null);
			
			expect(collection.show.row[1].label).to.equal(null);
			expect(collection.show.row[1].name).to.equal('age');
			expect(collection.show.row[1].type).to.equal('Number, min: 18, max:35');
			expect(collection.show.row[1].transformation).to.equal('age = age*2');
			
		});
		
	});

}); //end DSLParser unit test
