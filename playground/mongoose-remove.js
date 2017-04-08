var mongoose = require('./../server/db/mongoose.js').mongoose;
var objectId = require('mongodb').ObjectID;
const Todo = require('./../server/models/todo.js').Todo;
const User = require('./../server/models/user.js').User;

//Todo.remove({}).then((result) => {
//	console.log(result);
//});

Todo.findByIdAndRemove('58e8bcda71ae8f2630a98b48').then((todo) => {
	console.log(todo);
});