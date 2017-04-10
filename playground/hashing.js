const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var psw = '123abc';

bcrypt.genSalt(12, (err, salt) => {
	bcrypt.hash(psw, salt, (err, hash) => {
		console.log(hash);
	});
});

var hashedPassword = '$2a$12$o4zcjzMyMI8ANLnNYVdJx.kQWZBmCe27YvNXPFOIEP610bv6yVtPm';

bcrypt.compare(psw, hashedPassword,(err, result) => {
	console.log(result);
});

//var message = 'Iam user num 3';
//var hash = crypto.createHash('sha256',message).digest('hex');
//
//console.log(message, '---------------');
//console.log(hash, '---------------');
//
//var data = {
//	id: 4
//};
//var token = {
//	data,
//	hash: crypto.createHash('sha256',data).update('Some secret').digest('hex')
//};
//console.log('First Token',token);
//token.data.id = 5;
//console.log('Token',token);
//resultHash = crypto.createHash('sha256',token.data).digest('hex');
//
//if(resultHash === token.hash){
//	console.log('Data was not changed');
//} else {
//	console.log('Data was changed.Do not trust');
//}

//var data = {
//	id: 10
//};
//var token = jwt.sign(data, '123abc');
//console.log('Token: ', token);
//console.log('----------------------------');
//var decoded = jwt.verify(token, '123abc');
//console.log('Decoded: ', decoded);