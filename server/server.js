require('./config/config.js');

var mongoose = require('./db/mongoose.js').mongoose;
var Todo = require('./models/todo.js').Todo;
var User = require('./models/user.js').User;
var authenticate = require('./middlewear/authenticate.js').authenticate;

const ObjectId = require('mongodb').ObjectID;
const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

//POST SIGNUP
app.post('/users', (req, res) => {
	var body = _.pick(req.body,['username', 'email', 'password']);
	var user = new User(body);
	
	user.save().then((user) => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((err) => {
		res.status(400).send(err);
	});
});

//POST login
app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		});
	}).catch((err) => {
		res.status(400).send();
	});
});

app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	},() => {
		res.status(400).send();
	});
});

app.get('/todos', authenticate, (req, res) => {
	Todo.find({
						_creator: req.user._id
						}).then((doc) => {
								res.send(doc);	
							},(err) => {
								res.status(400).send(err);
							})
});

app.get('/todos/:id', authenticate, (req, res) => {
	if(!ObjectId.isValid(req.params.id)){
		res.status(404).send();
	}
	Todo.findOne({
		_id: req.params.id,
		_creator: req.user._id
	  }).then((todo) => {
		if(!todo){
			return res.status(404).send('Todo not found');
		}
		res.send(todo);
	}).catch((err) => {
		res.status(400).send(err);
	})
});

app.post('/todos', authenticate, (req, res) => {
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});
	
	todo.save().then((docs) => {
		res.send(docs);
	},(err) => {
		res.status(400).send(err);
	});
});

app.delete('/todos/:id', authenticate, (req, res) => {
	if(!ObjectId.isValid(req.params.id)){
		res.status(404).send('The id is invalid');
	}
	Todo.findOneAndRemove({
		                      _id: req.params.id,
		                      _creator: req.user._id
	                      }).then((todo) => {
		if(!todo){
			return res.status(404).send('Not found');
		}
		res.status(200).send(todo);
	}
	).catch((err) => {
		res.status(400).send(err);
	})
});

app.patch('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);
	
	if(!ObjectId.isValid(id)){
		return res.status(404).send();
	}
	
	if(_.isBoolean(body.completed) && body.completed){
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}
	
	Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
		if(!todo){
			return res.status(404).send();
		}
		res.send({todo})
	}).catch((err) => {
		res.status(400).send(err);
	});
});



app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

app.listen(port, () => {
	console.log('Started on port ' + port);
});

module.exports = {app};