const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err){
		console.log('Unable to connect to mongo server');
	}
	console.log('Connected to mongo server');
	db.collection('Todos').insertOne({
		                                 text     : 'Sleep',
		                                 completed: false
	                                 }, (err, result) => {
		if(err){
			return console.log('Unable to insert todo, err');
		}
	
		console.log(JSON.stringify(result.ops, undefined, 2));
	});

	//db.collection('Todos').insertOne({
	//	                                 name    : 'Zalex',
	//	                                 age     : 32,
	//	                                 location: 'Nowhere'
	//                                 }, (err, result) => {
	//	if(err){
	//		return console.log('Could not insert todo', err);
	//	}
	//	console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
	//});
	db.close();
});