/**
 * File: dispatcher.test.js
 * Module: test::controller
 * Author: Fabio Miotto
 * Created: 24/06/14
 * Version: 1.0.0
 * Description: test del dispatcher
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

var dispatcher = rewire("../../maap_server/controller/dispatcher.js");

describe("dispatcher Unit Test: ", function() {

	describe("init", function() {
		
		var dispatcher2use = {
			get: function(){
			
			},
			
			post: function(){
			
			},
			
			put: function(){
			
			},
			
			delete: function(){
			
			}		
		};
		
		var app = { express: {Router: function(){return dispatcher2use; } }};
		
		it("deve inizializzare passport", function() {
					
			var initPassport = function(app){};
			var spy = chai.spy(initPassport);
			dispatcher.__set__('passport', {init: spy} );
						
			dispatcher.init(app);
			
			expect(spy).to.have.been.called();
			
		});
		
	});

}); //end dispatcher Unit Test
