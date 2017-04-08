const expect = require('expect');
const request = require('supertest');

const ObjectId = require('mongodb').ObjectID;
const app = require('./../server.js').app;
const Todo = require('./../models/todo.js').Todo;
//const User = require('../models/user.js').User;

const todos = [
	{
		_id: new ObjectId(),
		text: 'First test todo'
	},
	{
		_id: new ObjectId(),
		text: 'Second test todo'
	}
];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos)
	}).then(() => done());
});

describe('POST /todos', () => {
	it('Should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
		})
		.end((err, res) => {
			if(err){
				return done(err);
			}
			Todo.find({text}).then((todos) => {
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
		.expect(200)
		.expect((res) => {
			expect(res.body.length).toBe(2);
		})
		.end(done)
	})
});

describe('GET /todos/:id', () => {
	it('Should return todo doc', (done) => {
		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(todos[0].text);
		})
		.end(done());
	});
	
//	describe('blalala', () => {
//		it('Should return 404 if todo not found', (done) => {
//			var hexId = new ObjectID().toHexString();
//			request(app)
//			.get(`/todos/${hexId}`)
//			.expect(404)
//			.end(done());
//		});
//	});
//
//	it('Should return 404 for noon objectIds', (done) => {
//		request(app)
//		.get(`/todos/123abc`)
//		.expect(404)
//		.end(done());
//	})
});

describe('Delete /todos/:id', () => {
	it('Should remove todo', (done) => {
		var hexId = todos[1]._id.toHexString();

		//noinspection JSUnresolvedFunction
		request(app).delete(`/todos/${hexId}`).expect(200).expect((res) => {
			expect(res.body.todo._id).toBe(hexId);
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
});