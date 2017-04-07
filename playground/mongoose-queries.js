const ObjectId = require('mongodb').ObjectID;
const mongoose = require('./../server/db/mongoose.js').mongoose;
const Todo = require('./../server/models/todo.js').Todo;
const User = require('./../server/models/user.js').User;
//var id = '58e7af6747f91a26183ef2dc11';
var userId = '58e65ec812a9022f945c714f';
var boarder = '--------------------------------------------'
;//if(!ObjectId.isValid(id)){
//	console.log('ID not valid');
//}
//Todo.find({
//	          _id: id
//          }).then((todos) => {
//	console.log('Todos ',todos)
//});
//
//Todo.findOne({
//	          _id: id
//          }).then((todo) => {
//	console.log('Todo', todo)
//});

//Todo.findById(id).then((todo) => {
//	if(!todo){
//		return console.log('Not found')
//	}
//	console.log('TodoByid', todo)
//}).catch((err) => {
//	console.log(err)
//});

User.find({}).then((users) => {
	console.log('All the users',JSON.stringify(users, undefined, 1));
	console.log(boarder);
},(err) => {
	console.log(err);
});
User.findById(userId).then((user) => {
	if(!user){
		return console.log('Not found')
	}
	console.log('user -->',user);
},(err) => {
	console.log(err);
});