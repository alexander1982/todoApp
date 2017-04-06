var mongoose = require('mongoose');

var User = mongoose.model('User', {
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 2
	},
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 10
	}
});

module.exports = {User};