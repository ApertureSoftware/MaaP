/**
 * File: DatabaseUserManager.test.js
 * Module: test::modelServer::dataManager::DatabaseUserManager
 * Author: Alessandro Benetti
 * Created: 20/06/14
 * Version: 1.0.0
 * Description: test del DatabaseUserManager
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

var userManager = rewire("../../../../maap_server/modelServer/dataManager/DatabaseUserManager/DatabaseUserManager.js");

describe("DatabaseUserManager Unit Test: ", function() {
	
	describe("checkMail", function() {
	
		it("deve rispondere con un 304 se la mail non e' presente", function() {
			
			userManager.__set__('DB', {users: {count: function(data, callback){callback(false, 0);}}} );
			
			var req = { body: {
								field: 'test@mail.com'
								}
						};
			
			userManager.checkMail(req, {send: function(response){
				expect(response).to.equal(304);
			}});
		
		});
		
		it("deve rispondere con un 400 se la mail e' gia' presente", function() {
			
			userManager.__set__('DB', {users: {count: function(data, callback){callback(false, 1);}}} );
			
			var req = { body: {
								field: 'test@mail.com'
								}
						};
			
			userManager.checkMail(req, {send: function(response){
				expect(response).to.equal(400);
			}});
		
		});
		
	});
	
	describe("userSignup", function() {
	
		it("deve rispondere con un 400 se le due password pw1 e pw2 sono diverse", function() {
			
			userManager.__set__('DB', {users: {count: function(data, callback){callback(false, 1);}}} );
			userManager.__set__('retriever', {addUser: function(email, password, level, callback){callback(true);}} );
			
			var req = { body: {
								pwd1: 'pwd1',
								pwd2: 'pwd2',
								email: 'test@mail.com'
								}
						};
			
			userManager.userSignup(req, {send: function(response){
				expect(response).to.equal(400);
			}}, {next: function(){ } });
		
		});
		
		it("deve rispondere con un 400 se l'utente e' gia' presente nel DB", function() {
			
			userManager.__set__('DB', {users: {count: function(data, callback){callback(false, 1);}}} );
			userManager.__set__('retriever', {addUser: function(email, password, level, callback){callback(true);}} );
			
			var req = { body: {
								pwd1: 'samePWD',
								pwd2: 'samePWD',
								email: 'test@mail.com'
								}
						};
			
			userManager.userSignup(req, {send: function(response){
				expect(response).to.equal(400);
			}}, {next: function(){ } });
		
		});
		
		it("deve rispondere con 400 se la registrazione non ha successo", function() {
			
			userManager.__set__('DB', {users: {count: function(data, callback){callback(false, 0);}}} );
			userManager.__set__('retriever', {addUser: function(email, password, level, callback){callback(false);}} );
			
			var req = { body: {
								pwd1: 'samePWD',
								pwd2: 'samePWD',
								email: 'test@mail.com'
								}
						};
			
			userManager.userSignup(req, {send: function(response){
				expect(response).to.equal(400);
			}}, {next: function(){ } });
		
		});
		
		it("deve richiamare next() se la registrazione ha successo", function() {
			
			userManager.__set__('DB', {users: {count: function(data, callback){callback(false, 0);}}} );
			userManager.__set__('retriever', {addUser: function(email, password, level, callback){callback(true);}} );
			
			var req = { body: {
								pwd1: 'samePWD',
								pwd2: 'samePWD',
								email: 'test@mail.com'
								}
						};
					
			var next = function(){};
			
			var spy = chai.spy(next);
			
			userManager.userSignup(req, {send: function(response){}}, spy);
					
			expect(spy).to.have.been.called();
			
		});
		
	});
	
	describe("sendUserProfile", function() {
	
		it("deve passare l'user_id al dataRetriever", function() {
			
			userManager.__set__('JSonComposer', {createUserProfile: function(user_id){return user_id;}} );
			userManager.__set__('retriever', {getUserProfile: function(user_id, callback){callback(user_id);}} );
			
			var req = { session: {passport: {user: {_id: 'userID'}}}};
			
			userManager.sendUserProfile(req, {send: function(response){
				expect(response).to.equal('userID');
			}});
		
		});
		
		it("deve rispondere con il JSON creato dal JSonComposer", function() {
			
			userManager.__set__('JSonComposer', {createUserProfile: function(user_id){return 'userJSON';}} );
			userManager.__set__('retriever', {getUserProfile: function(user_id, callback){callback('userID');}} );
			
			var req = { session: {passport: {user: {_id: 'userID'}}}};
			
			userManager.sendUserProfile(req, {send: function(response){
				expect(response).to.equal('userJSON');
			}});
		
		});
		
	});
	
	describe("sendUserProfileEdit", function() {
	
		it("deve passare l'user_id al dataRetriever", function() {
			
			userManager.__set__('JSonComposer', {createUserProfileEdit: function(user_id){return user_id;}} );
			userManager.__set__('retriever', {getUserProfile: function(user_id, callback){callback(user_id);}} );
			
			var req = { session: {passport: {user: {_id: 'userID'}}}};
			
			userManager.sendUserProfileEdit(req, {send: function(response){
				expect(response).to.equal('userID');
			}});
		
		});
		
		it("deve rispondere con il JSON creato dal JSonComposer", function() {
			
			userManager.__set__('JSonComposer', {createUserProfileEdit: function(user_id){return 'userJSON';}} );
			userManager.__set__('retriever', {getUserProfile: function(user_id, callback){callback('userID');}} );
			
			var req = { session: {passport: {user: {_id: 'userID'}}}};
			
			userManager.sendUserProfileEdit(req, {send: function(response){
				expect(response).to.equal('userJSON');
			}});
		
		});
		
	});
	
	describe("updateUserProfile", function() {
	
		it("deve rispondere con un codice 200 se l'update ha successo", function() {
			
			userManager.__set__('retriever', {updateUserProfile: function(req, callback){callback(true);}} );
			
			var req = {body: {}};
			
			userManager.updateUserProfile(req, {send: function(responseCode){
				expect(responseCode).to.equal(200);
			}});
		
		});
		
		it("deve rispondere con un codice 400 se l'update non ha successo", function() {
			
			userManager.__set__('retriever', {updateUserProfile: function(req, callback){callback(false);}} );
			
			var req = {body: {}};
			
			userManager.updateUserProfile(req, {send: function(responseCode){
				expect(responseCode).to.equal(400);
			}});
		
		});
		
	});
	
	describe("getUsersList", function() {
	
		it("deve usare l'ordinameno imposto dalla query presente nella request", function() {
			
			userManager.__set__('JSonComposer', {createUsersList: function(data, options){return data;}} );
			userManager.__set__('retriever', {getUsersList: function(column, order, page, perpage, callback){callback({data: [column, order, page, perpage], options: {}});}} );
			
			var req = { query: {
								page: 2,
								column: 'name',
								order: 'desc'
								},
						config: {
								adminConfig: {
									usersPerPage: 10
								}
						}};
			
			userManager.getUsersList(req, {send: function(response){
				expect(response[0]).to.equal('name');
				expect(response[1]).to.equal('desc');
				expect(response[2]).to.equal(2);
				expect(response[3]).to.equal(10);
			}});
		
		});
		
		it("deve usare l'ordinameno di default se la query non e' presente nella request", function() {
			
			userManager.__set__('JSonComposer', {createUsersList: function(data, options){return data;}} );
			userManager.__set__('retriever', {getUsersList: function(column, order, page, perpage, callback){callback({data: [column, order, page, perpage], options: {}});}} );
			
			var req = { query: {},
						config: {adminConfig: {}}
						};
			
			userManager.getUsersList(req, {send: function(response){
				expect(response[0]).to.equal('_id');
				expect(response[1]).to.equal('asc');
				expect(response[2]).to.equal(0);
				expect(response[3]).to.equal(22);
			}});
		
		});
		
		it("deve rispondere con il JSON creato dal JSonComposer", function() {
			
			userManager.__set__('JSonComposer', {createUsersList: function(data, options){return 'userJSON';}} );
			userManager.__set__('retriever', {getUsersList: function(column, order, page, perpage, callback){callback({data: ['user1', 'user2'], options: {}});}} );
			
			var req = { query: {
								page: 2,
								column: 'name',
								order: 'desc'
								},
						config: {
								adminConfig: {
									usersPerPage: 10
								}
						}};
			
			userManager.getUsersList(req, {send: function(response){
				expect(response).to.equal('userJSON');
			}});
		
		});
		
	});
	
	describe("sendUser", function() {
	
		it("deve rispondere con il JSON creato dal JSonComposer", function() {
			
			userManager.__set__('JSonComposer', {createUser: function(user_id){return 'user';}} );
			userManager.__set__('retriever', {getUserProfile: function(user_id, callback){callback('userID');}} );
			
			var req = { params: {user_id: 'userID'}};
			
			userManager.sendUser(req, {send: function(response){
				expect(response).to.equal('user');
			}});
		
		});
		
	});
	
	describe("sendUserEdit", function() {
	
		it("deve rispondere con il JSON creato dal JSonComposer", function() {
			
			userManager.__set__('JSonComposer', {createUser: function(user_id){return 'user';}} );
			userManager.__set__('retriever', {getUserProfile: function(user_id, callback){callback('userID');}} );
			
			var req = { params: {user_id: 'userID'}};
			
			userManager.sendUserEdit(req, {send: function(response){
				expect(response).to.equal('user');
			}});
		
		});
		
	});
	
	describe("updateUser", function() {
	
		it("deve rispondere con un codice 200 se l'update ha successo", function() {
			
			userManager.__set__('retriever', {updateUser: function(req, callback){callback(true);}} );
			
			var req = {body: {}};
			
			userManager.updateUser(req, {send: function(responseCode){
				expect(responseCode).to.equal(200);
			}});
		
		});
		
		it("deve rispondere con un codice 400 se l'update non ha successo", function() {
			
			userManager.__set__('retriever', {updateUser: function(req, callback){callback(false);}} );
			
			var req = {body: {}};
			
			userManager.updateUser(req, {send: function(responseCode){
				expect(responseCode).to.equal(400);
			}});
		
		});
		
	});
	
	describe("removeUser", function() {
	
		it("deve rispondere con un codice 200 se la rimozione ha successo", function() {
			
			userManager.__set__('retriever', {removeUser: function(user_id, callback){callback(true);}} );
			
			var req = { params: {user_id: 'userID'}};
			
			userManager.removeUser(req, {send: function(responseCode){
				expect(responseCode).to.equal(200);
			}});
		
		});
		
		it("deve rispondere con un codice 400 se la rimozione non ha successo", function() {
			
			userManager.__set__('retriever', {removeUser: function(user_id, callback){callback(false);}} );
			
			var req = { params: {user_id: 'userID'}};
			
			userManager.removeUser(req, {send: function(responseCode){
				expect(responseCode).to.equal(400);
			}});
		
		});
		
	});
	
	
}); //end DatabaseUserManager Unit Test
