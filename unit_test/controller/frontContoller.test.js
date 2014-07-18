/**
 * File: frontController.test.js
 * Module: test::controller
 * Author: Alessandro Benetti
 * Created: 24/06/14
 * Version: 1.0.0
 * Description: test del frontController
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

var frontController = rewire("../../maap_server/controller/frontController.js");

describe("frontController Unit Test: ", function() {

	describe("init", function() {
		
		it("deve inizializzare il dispatcher", function() {
		
			var initDispatcher = function(app){};
			var spy = chai.spy(initDispatcher);
			frontController.__set__('dispatcher', {init: spy} );
			
			var appUse = function(route, dispatcher){};
			var spy2 = chai.spy(appUse);
			var app = {use: spy2};
						
			frontController.init(app);
			
			expect(spy).to.have.been.called();
			expect(spy2).to.have.been.called();
			
		});
		
	});

}); //end frontController Unit Test
