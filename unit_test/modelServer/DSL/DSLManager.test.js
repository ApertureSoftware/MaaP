/**
 * File: DSLManager.test.js
 * Module: test::modelServer::DSL
 * Author: Fabio Miotto
 * Created: 23/06/14
 * Version: 1.0.0
 * Description: test del DSL manager
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

var DSLManager = require("../../../maap_server/modelServer/DSL/DSLManager.js");

describe("DSLManager Unit Test: ", function() {

	describe("generateFunction", function() {
			
		it("deve generare una funzione corretta per traformazioni di campi dati con nomi singoli", function() {
			var transformation = {name: 'age', transformation: 'age = age * 2;'};
			var expectedResult = '//maaperture auto-generated function for item \'age\':\n\nexports.transformation = function(age) {\nvar originalValue = age;\ntry{\nage = age * 2;\n}catch(err){\nconsole.log(\'transformation error: \' + err);\nage = \'transformation failed, check your DSL [ \' + originalValue + \' ]\';\n}\nreturn age;\n}\n';
			var result = DSLManager.generateFunction(transformation);
			expect(result).to.equal(expectedResult);
		}),
		
		it("deve generare una funzione corretta per traformazioni di campi dati con nomi composti", function() {
			var transformation = {name: 'coach.age', transformation: 'age = age * 2;'};
			var expectedResult = '//maaperture auto-generated function for item \'age\':\n\nexports.transformation = function(age) {\nvar originalValue = age;\ntry{\nage = age * 2;\n}catch(err){\nconsole.log(\'transformation error: \' + err);\nage = \'transformation failed, check your DSL [ \' + originalValue + \' ]\';\n}\nreturn age;\n}\n';
			var result = DSLManager.generateFunction(transformation);
			expect(result).to.equal(expectedResult);
		});

	});
	
	describe("deleteFolderRecursive", function() {
	
	});
	
	describe("saveFile", function() {
	
	});
	
	describe("checkDSL", function() {
	
	});

}); //end DSLManager unit test
