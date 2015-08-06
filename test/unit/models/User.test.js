var assert = require('assert');
var request = require('supertest');

describe('user', function(){
	it('Should be able to create users in parallel.', function(done){
		Promise.all([
          User.register({username: 'user1', email: 'user1@test.com', password: 'password'}),
          User.register({username: 'user2', email: 'user2@test.com', password: 'password'}),
          User.register({username: 'user3', email: 'user3@test.com', password: 'password'}),
          User.register({username: 'user4', email: 'user4@test.com', password: 'password'})
		])
		.spread(function(user1, user2, user3, user4){
			Promise.all([
				request(sails.hooks.http.app)
			        .get('/permission')
					.set('Authorization', 'Basic ' + new Buffer(user1.username + ":password").toString('base64'))
			        .expect(200),
				request(sails.hooks.http.app)
			        .get('/permission')
					.set('Authorization', 'Basic ' + new Buffer(user2.username + ":password").toString('base64'))
			        .expect(200),
				request(sails.hooks.http.app)
			        .get('/permission')
					.set('Authorization', 'Basic ' + new Buffer(user3.username + ":password").toString('base64'))
			        .expect(200),
				request(sails.hooks.http.app)
			        .get('/permission')
					.set('Authorization', 'Basic ' + new Buffer(user4.username + ":password").toString('base64'))
			        .expect(200)
			])
			.done(function(){
				done();
			})
		})
		.catch(function(err) {
			done(err);
		});
	});
});