const mongoose = require('mongoose')

const Post = mongoose.model('Post', {
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true,
		trim: true
	},
	date: {
		type: Date,
		default: Date.now()
	},
	_creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
})

module.exports = { Post }
