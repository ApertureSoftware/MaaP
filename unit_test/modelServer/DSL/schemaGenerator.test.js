/**
 * File: schemaGenerator.test.js
 * Module: test::modelServer::DSL
 * Author: Michele Maso
 * Created: 23/06/14
 * Version: 1.0.0
 * Description: test dello schemaGenerator
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

var schemaGenerator = require("../../../maap_server/modelServer/DSL/schemaGenerator.js");

describe("schemaGenerator Unit Test: ", function() {

	describe("getPopulatedCollection", function() {

		var populateArray = [];
		populateArray.push({collection: 'collection1', key: 'testkey1'});
		populateArray.push({collection: 'collection2', key: 'testkey2'});
			
		it("populateArray deve avere un oggetto contenente la chiave testkey2", function() {
			var result = schemaGenerator.getPopulatedCollection(populateArray, 'testkey2');
			expect(result).to.equal('collection2');
		}),
		
		it("populateArray non deve avere nessun oggetto contenente la chiave testkey3", function() {
			var result = schemaGenerator.getPopulatedCollection(populateArray, 'testkey3');
			expect(result).to.equal('');
		});

	});

	describe("arrayAddElement", function() {

		var array = [];
		array.push({key: 'key1'});
		array.push({key: 'key2'});
			
		it("resultArray non deve avere un nuovo campo", function() {
			var element = {key: 'key2'};
			var resultArray = schemaGenerator.arrayAddElement(element, array);
			expect(resultArray.length).to.equal(array.length);
		}),
		
		it("resultArray deve avere un nuovo campo contenente un oggetto con campo key == key3", function() {
			var element = {key: 'key3'};
			var resultArray = schemaGenerator.arrayAddElement(element, array);
			expect(resultArray.length).to.equal(3);
			expect(resultArray[2]).to.have.property('key');
			expect(resultArray[2].key).to.equal('key3');
		});
		
	});

	describe("generate", function() {

		var dslJson = require("./membersForSchemaGenerator.json");
		var config = require("./configForSchemaGenerator.js");

		var jsString = schemaGenerator.generate(config, dslJson);
		var expectedResult = '//maaperture auto-generated mongoose schema for collection \'members\'\n\nvar mongoose = require(\'mongoose\');\nvar ObjectId = mongoose.Schema.ObjectId;\n\nexports.schemaName = \'members\';\n\nexports.schema = new mongoose.Schema({\nname: { type: String },\nsurname: { type: String },\nemail: { type: String },\nage: { type: Number, min: 18, max:35 },\ninterest: { type: [String] }\n}, { autoIndex: false, collection: \'members\' });\n\n';
				
		it("generate deve generare uno schema corretto", function() {
			expect(jsString).to.equal(expectedResult);
		});
		
	});

}); //end schemaGenerator unit test
