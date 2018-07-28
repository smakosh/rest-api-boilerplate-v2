const mongoose = require('mongoose')

const { Schema } = mongoose

const Profile = mongoose.model('Profile', {
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	type: {
		type: String,
		required: true
	},
	handle: {
		type: String
	},
	date: {
		type: Date,
		default: Date.now()
	}
})

module.exports = { Profile }
