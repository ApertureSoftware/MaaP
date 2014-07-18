/**
 * File: index.test.js
 * Module: test::controller
 * Author: Alessandro Benetti
 * Created: 20/06/14
 * Version: 1.0.0
 * Description: test dell'index del controller
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

var controllerIndex = rewire("../../maap_server/controller/index.js");

describe("controllerIndex Unit Test: ", function() {

	describe("init", function() {
		
		it("deve inizializzare il front controller", function() {
		
			var initFrontController = function(app){};
			var spy = chai.spy(initFrontController);
			
			controllerIndex.__set__('frontController', {init: spy} );
						
			var app = {};
			controllerIndex.init(app);
			
			expect(spy).to.have.been.called();
			
		});
		
	});

}); //end controllerIndex Unit Test
