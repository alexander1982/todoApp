const expect = require('expect');
const request = require('supertest');
const todos = require('./seed/seed.js').todos;
const users = require('./seed/seed.js').users;
const populateTodos = require('./seed/seed.js').populateTodos;
const populateUsers = require('./seed/seed.js').populateUsers;

const ObjectId = require('mongodb').ObjectID;
const app = require('./../server.js').app;
const Todo = require('./../models/todo.js').Todo;
const User = require('../models/user.js').User;

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('PATCH todo/:id', () => {
	
	it('Should update the todo', (done) => {
		var text = 'Some bs text';
		var hexId = todos[0]._id.toHexString();
		request(app)
		.patch(`/todos/${hexId}`)
		.set('x-auth', users[0].tokens[0].token)
		.send({
           completed: true,
           text
         })
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(true);
			expect(res.body.todo.completedAt).toBeA('number');
		}).end(done);
	});

	it('Should not update the todo created y another user', (done) => {
		var text = 'Some bs text';
		var hexId = todos[1]._id.toHexString();
		request(app)
		.patch(`/todos/${hexId}`)
		.set('x-auth', users[0].tokens[0].token)
		.send({
			      completed: true,
			      text
		      })
		.expect(404)
		.end(done);
	});

	it('should clear completedAt when todo is not completed', (done) => {
		var hexId = todos[1]._id.toHexString();
		var text = 'Some updated text';
		request(app)
		.patch(`/todos/${hexId}`)
		.set('x-auth', users[1].tokens[0].token)
		.send({
           completed: false,
           text
         })
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(false);
			expect(res.body.todo.completedAt).toNotExist();
		}).end(done);
	});
});

describe('POST /todos', () => {
	it('Should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app).post('/todos')
		.set('x-auth', users[0].tokens[0].token)
		.send({ text })
		.expect(200)
		.expect((res) => {
			expect(res.body.text).toBe(text);
		}).end((err, res) => {
			if(err){
				return done(err);
			}
			Todo.find({ text }).then((todos) => {
				expect(todos.length).toBe(1);
				expect(todos[0].text).toBe(text);
				done();
			}).catch((err) => done(err))
		})
	})
});

it('Should not create todo with invalid body data', (done) => {
	request(app)
	.post('/todos')
	.set('x-auth', users[0].tokens[0].token)
	.send({})
	.expect(400)
	.end((err, res) => {
		if(err){
			return done(err);
		}

		Todo.find().then((todos) => {
			expect(todos.length).toBe(2);
			done();
		}).catch((err) => done(err))
	})
});

describe('GET /todos ', () => {
	it('Should get all todos', (done) => {
		request(app)
		.get('/todos')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body.length).toBe(1);
		}).end(done)
	})
});

describe('GET /todos/:id', () => {
	var hexId = todos[0]._id.toHexString();
	it('Should return todo doc', (done) => {
		request(app)
		.get(`/todos/${hexId}`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body.text).toBe(todos[0].text);
		}).end(done);
	});

	it('Should not return todo doc created by other user', (done) => {
		request(app)
		.get(`/todos/${todos[1]._id.toHexString()}`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(404)
		.end(done);
	});

	describe('404', () => {
		it('Should return 404 if todo not found', (done) => {
			var hexId = new ObjectId().toHexString() + 1;
			request(app)
			.get(`/todos/${hexId}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
		});
	});

	it('Should return 404 for non objectIds', (done) => {
		request(app)
		.get(`/todos/123abc`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(404).
		end(done);
	})
});

describe('Delete /todos/:id', () => {
	it('Should remove todo', (done) => {
		var hexId = todos[1]._id.toHexString();

		//noinspection JSUnresolvedFunction
		request(app)
		.delete(`/todos/${hexId}`)
		.set('x-auth', users[1].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body._id).toBe(hexId);
		}).end((err, res) => {
			if(err){
				return done(err);
			}

			Todo.findById(hexId).then((todo) => {
				expect(todo).toNotExist();
				done();
			}).catch((err) => {
				done(err);
			})
		})
	});

	it('Should not remove todo', (done) => {
		var hexId = todos[0]._id.toHexString();

		//noinspection JSUnresolvedFunction
		request(app)
		.delete(`/todos/${hexId}`)
		.set('x-auth', users[1].tokens[0].token)
		.expect(404)
		.end((err, res) => {
			if(err){
				return done(err);
			}

			Todo.findById(hexId).then((todo) => {
				expect(todo).toExist();
				done();
			}).catch((err) => {
				done(err);
			})
		})
	});

	it('Should return 404 if Object id is invalid', (done) => {
		var hexId = todos[0]._id.toHexString();
		//noinspection JSUnresolvedFunction
		request(app)
		.delete(`/todos/${hexId}`)
		.set('x-auth', users[1].tokens[0].token)
		.expect(404)
		.end(done)
	});
});

describe('GET /users/me', () => {
	it('Should return user if authenticated', (done) => {
		request(app).get('/users/me').set('x-auth', users[0].tokens[0].token).expect(200).expect((res) => {
			expect(res.body._id).toBe(users[0]._id.toHexString());
			expect(res.body.email).toBe(users[0].email);
		}).end(done)
	});

	it('Should return 401 if not authenticated', (done) => {
		request(app).get('/users/me').expect(401).expect((res) => {
			expect(res.body).toEqual({});
		}).end(done);
	});
});

describe('POST /users', () => {
	it('Should create a user', (done) => {
		var email = 'example@gmail.com';
		var password = '123abc4567';
		var username = 'alloha';

		request(app).post('/users').send({ username, email, password }).expect(200).expect((res) => {
			expect(res.headers['x-auth']).toExist();
			expect(res.body._id).toExist();
			expect(res.body.email).toBe(email);
		}).end((err) => {
			if(err){
				return done(err);
			}

			User.findOne({ email }).then((user) => {
				expect(user).toExist();
				expect(user.password).toNotBe(password);
				done();
			}).catch((err) => done(err))
		})
	});

	it('Should return validation error if request is invalid', (done) => {
		var password = '11111hfghfghfghfg';
		var email = 'dddgmail.com';
		var username = 'add';
		request(app).post('/users').send({ username, email, password }).expect(400).expect((res) => {
			expect(res.body.name).toBe('ValidationError');
		}).end(done);
	});

	it('Should not create a user if email in use', (done) => {
		var password = '11111hfghfghfghfg';
		var email = 'alex@gmail.com';
		var username = 'add';

		request(app).post('/users').send({ username, email, password }).expect(400).end(done)
	});
});

describe('POST /users/login', () => {
	it('Should login user and return auth token', (done) => {
		request(app)
		.post('/users/login')
		.send({
           email   : users[1].email,
           password: users[1].password
         })
		.expect(200)
		.expect((res) => {
			expect(res.headers['x-auth']).toExist();
		})
		.end((err, res) => {
			if(err){
				return res.send(err);
			}
			User.findById(users[1]._id).then((user) => {
				expect(user.tokens[1]).toInclude({
					                                 access: 'auth',
					                                 token : res.headers['x-auth']
				                                 });
				done();
			}).catch((err) => done(err))
		})
	});

	it('Should reject invalid login', (done) => {
		request(app)
		.post('/users/login')
		.send({
			email: users[0].email,
			password: '12345678980'
		               })
		.expect(400)
		.expect((res) => {
			expect(res.headers['x-auth']).toNotExist();
		})
		.end((err,res) => {
			if(err){
				return done(err);
			}

			User.findById(users[1]._id).then((user) => {
				expect(user.tokens.length).toBe(1);
				done();
			}).catch((err) => done(err))
		})
	});
});

describe('DELETE /users/me/token', () => {
	it('Should remove authToken on logout', (done) => {
		request(app)
		.delete('/users/me/token')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			
			User.findById(users[0]._id).then((user) => {
				expect(user.tokens.length).toBe(0);
				done();
			}).catch((err) => done(err))
		});
	})
});