var MongoClient = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var yargs = require('yargs');
var argv = yargs.options({
	                         n: {
		                         demand  : true,
		                         alias   : 'name',
		                         describe: 'Enter a name to find in DB',
		                         string  : true
	                         }
                         }).help().alias('h', 'help').argv;
console.log(argv);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err){
		console.log('Unable to connect to TodoApp db');
	}
	console.log('Connected to TodoApp Data Base');

	//db.collection('Todos').find({
	//	                            _id: new objectId('58e50d165ce2121a9cf00aca')
	//                            }).toArray().then((docs) => {
	//	console.log('Todos');

	//	console.log(JSON.stringify(docs, undefined, 1));
	//},(err) => {
	//	console.log(err);
	//});

	//db.collection('Todos').find().count().then((count) => {
	//	console.log(`Todos count: ${count}`);
	//},(err) => {
	//	console.log(err);
	//});
	db.collection('Todos').find({name: argv.name}).toArray().then((docs) => {
		console.log(JSON.stringify(docs, undefined, 1));
	}, (err) => {
		console.log(err);
	});

	db.close();
});