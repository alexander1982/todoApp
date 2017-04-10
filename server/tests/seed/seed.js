const Todo = require('./../../models/todo.js').Todo;
const User = require('./../../models/user.js').User;
const ObjectId = require('mongodb').ObjectID;
const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const jwt = require('jsonwebtoken');

const users = [{
	_id: userOneId,
	username: 'Aloo',
	email: 'alex@gmail.com',
	password: 'userOnePass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
	}]
},
	{
		_id: userTwoId,
		username: 'jenifer',
		email: 'jen@gmail.com',
		password: 'userTwoPass'
	}
];

const todos = [
	{
		_id: new ObjectId(),
		text: 'First test todo'
	},
	{
		_id: new ObjectId(),
		text: 'Second test todo',
		completed: true,
		completedAt: 333
	}
];

const populateTodos = (done) => {
		Todo.remove({}).then(() => {
			return Todo.insertMany(todos)
		}).then(() => done());
};

const populateUsers = (done) => {
	User.remove({}).then(() => {
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();
		
		return Promise.all([userOne, userTwo])
	}).then(() => {
		done();
	});
};

module.exports = {
	todos,
	populateTodos,
	users,
	populateUsers
};