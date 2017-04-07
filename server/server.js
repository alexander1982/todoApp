var mongoose = require('./db/mongoose.js').mongoose;
var Todo = require('./models/todo.js').Todo;
var User = require('./models/user.js').User;
const ObjectId = require('mongodb').ObjectID;

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

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

app.post('/users', (req, res) => {
	var user = new User({
		name: req.body.name,
		email: req.body.email
	});
	
	user.save().then((docs) => {
		res.send(docs);
	},(err) => {
		res.status(400).send(err.errors.text.message);
	});
});


app.listen(3000, () => {
	console.log('Started on port 3000');
});

module.exports = {app};