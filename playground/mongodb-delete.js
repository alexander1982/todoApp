var MongoClient = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var yargs = require('yargs');
//var argv = yargs.options({
//	                         n: {
//		                         demand  : true,
//		                         alias   : 'name',
//		                         describe: 'Enter a name to find in DB',
//		                         string  : true
//	                         }
//                         }).help().alias('h', 'help').argv;
//console.log(argv);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err){
		console.log('Unable to connect to TodoApp db');
	}
	console.log('Connected to TodoApp Data Base');

	//delete many
	db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
		console.log(result);
	});
	//deleteOne
	//db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
	//	console.log(result);
	//});
	//findOneAndDelete
	//db.collection('Todos').findOneAndDelete({_id: new objectId('58e54399858a8d2c54329438')}).then((result) => {
	//	console.log(result.value);
	//});

	//db.close();
});