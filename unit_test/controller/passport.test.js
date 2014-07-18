/**
 * File: passport.test.js
 * Module: test::controller
 * Author: Alessandro Benetti
 * Created: 23/06/14
 * Version: 1.0.0
 * Description: test di passport
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

var passport = require("../../maap_server/controller/passport.js");

describe("passport Unit Test: ", function() {

	var request = function(_logged, _level){
		this.session = {
			passport: {
				user: {
					level: _level
				}
			}
		};
		
		this.isAuthenticated = function isAuthenticated(){ 
			return _logged; 
		};
	};
		
	var response = function() {
		this.statusCode = null;
		this.send = function(status){
			this.statusCode = status;
		};
	};

	describe("initPassport", function() {
	
	});
	
	describe("forgotPassword", function() {
	
	});
	
	describe("checkAuthenticatedAdmin", function() {
		
		it("un utente non autenticato normale non deve essere autenticato admin", function(done) {
			var res = new response();
			var req = new request(false, 0);
			var next = function(){};
			passport.checkAuthenticatedAdmin(req, res, next);
			expect(res.statusCode).to.equal(401);
			done();
		}),
		
		it("un utente non autenticato admin non deve essere autenticato admin", function(done) {
			var res = new response();
			var req = new request(false, 1);
			var next = function(){};
			passport.checkAuthenticatedAdmin(req, res, next);
			expect(res.statusCode).to.equal(401);
			done();
		}),
		
		it("un utente autenticato normale non deve essere autenticato admin", function(done) {
			var res = new response();
			var req = new request(true, 0);
			var next = function(){};
			passport.checkAuthenticatedAdmin(req, res, next);
			expect(res.statusCode).to.equal(401);
			done();
		}),
		
		it("un utente autenticato admin deve essere autenticato admin", function() {
			var res = new response();
			var req = new request(true, 1);
			var next = function(){};
			passport.checkAuthenticatedAdmin(req, res, next);
			expect(res.statusCode).to.equal(null);
		});
		
	});


	describe("checkAuthenticated", function() {
			
		it("un utente non autenticato normale non deve essere autenticato", function(done) {
			var res = new response();
			var req = new request(false, 0);
			var next = function(){};
			passport.checkAuthenticated(req, res, next);
			expect(res.statusCode).to.equal(401);
			done();
		}),
		
		it("un utente non autenticato admin non deve essere autenticato", function(done) {
			var res = new response();
			var req = new request(false, 1);
			var next = function(){};
			passport.checkAuthenticated(req, res, next);
			expect(res.statusCode).to.equal(401);
			done();
		}),
		
		it("un utente autenticato normale deve essere autenticato", function(done) {
			var res = new response();
			var req = new request(true, 0);
			var next = function(){};
			passport.checkAuthenticated(req, res, next);
			expect(res.statusCode).to.equal(null);
			done();
		}),
		
		it("un utente autenticato admin deve essere autenticato", function() {
			var res = new response();
			var req = new request(true, 1);
			var next = function(){};
			passport.checkAuthenticated(req, res, next);
			expect(res.statusCode).to.equal(null);
		});

	});

	describe("checkNotAuthenticated", function() {

		it("un utente non autenticato normale deve essere non autenticato", function(done) {
			var res = new response();
			var req = new request(false, 0);
			var next = function(){};
			passport.checkNotAuthenticated(req, res, next);
			expect(res.statusCode).to.equal(null);
			done();
		}),
		
		it("un utente non autenticato admin deve essere non autenticato", function(done) {
			var res = new response();
			var req = new request(false, 1);
			var next = function(){};
			passport.checkNotAuthenticated(req, res, next);
			expect(res.statusCode).to.equal(null);
			done();
		}),
		
		it("un utente autenticato normale deve essere autenticato", function(done) {
			var res = new response();
			var req = new request(true, 0);
			var next = function(){};
			passport.checkNotAuthenticated(req, res, next);
			expect(res.statusCode).to.equal(401);
			done();
		}),
		
		it("un utente autenticato admin deve essere autenticato", function() {
			var res = new response();
			var req = new request(true, 1);
			var next = function(){};
			passport.checkNotAuthenticated(req, res, next);
			expect(res.statusCode).to.equal(401);
		});

	});

}); //end passport unit test
