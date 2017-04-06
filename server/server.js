var mongoose = require('./db/mongoose.js').mongoose;
var Todo = require('./models/todo.js').Todo;
var User = require('./models/user.js').User;

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

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