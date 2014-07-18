/**
 * File: index.test.js
 * Module: test::modelServer::DSL
 * Author: Alessandro Benetti
 * Created: 20/06/14
 * Version: 1.0.0
 * Description: test dell'index del DSL
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

var dslIndex = rewire("../../../maap_server/modelServer/DSL/index.js");

describe("dslIndex Unit Test: ", function() {

	describe("init", function() {
		
		it("deve controllare i DSL presenti nel sistema", function() {
		
			var checkDSL = function(app){};
			var spy = chai.spy(checkDSL);
			
			dslIndex.__set__('DSL', {checkDSL: spy} );
						
			var app = {};
			dslIndex.init(app);
			
			expect(spy).to.have.been.called();
			
		});
		
	});

}); //end dslIndex Unit Test
