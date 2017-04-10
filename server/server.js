require('./config/config.js');

var mongoose = require('./db/mongoose.js').mongoose;
var Todo = require('./models/todo.js').Todo;
var User = require('./models/user.js').User;

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

app.get('/todos', (req, res) => {
	Todo.find({}).then((doc) => {
		res.send(doc);	
	},(err) => {
		res.status(400).send(err);
	})
});

app.get('/todos/:id', (req, res) => {
	if(!ObjectId.isValid(req.params.id)){
		res.status(404).send('Id is not valid');
	}
	Todo.findById(req.params.id).then((todo) => {
		if(!todo){
			res.send('Todo not found');
		}
		res.send(todo);
	}).catch((err) => {
		res.status(400).send(err);
	})
});

app.post('/todos', (req, res) => {
	var todo = new Todo({
		text: req.body.text
	});
	
	todo.save().then((docs) => {
		res.send(docs);
	},(err) => {
		res.status(400).send(err);
	});
});

app.delete('/todos/:id', (req, res) => {
	if(!ObjectId.isValid(req.params.id)){
		res.status(404).send('The id is invalid');
	}
	Todo.findByIdAndRemove(req.params.id).then((todo) => {
		if(!todo){
			return res.send('Not found');
		}
		res.status(200).send(todo);
	}
	).catch((err) => {
		res.status(400).send(err);
	})
});

app.patch('/todos/:id', (req, res) => {
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
	
	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
		if(!todo){
			return res.status(404).send();
		}
		res.send({todo})
	}).catch((err) => {
		res.status(400).send(err);
	});
});

app.listen(port, () => {
	console.log('Started on port ' + port);
});

module.exports = {app};