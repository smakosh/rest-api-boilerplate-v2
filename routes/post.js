const express = require('express')
const _ = require('lodash')
const { ObjectID } = require('mongodb')
const { authenticate } = require('../middleware/authenticate')
const { Post } = require('../models/post')

const router = express.Router()

router.post('/', authenticate, (req, res) => {
	const post = new Post({
		title: req.body.title,
		description: req.body.description,
		_creator: res.user._id
	})

	post.save()
		.then(doc => res.status(200).json(doc))
		.catch(() => res.status(400).send({ error: 'Something went wrong' }))
})

router.get('/', authenticate, (req, res) => {
	Post.find({ _creator: res.user._id })
		.then(posts => res.status(200).json(posts))
		.catch(() => res.status(400).json({ error: 'This user has no posts added' }))
})

router.get('/:id', authenticate, (req, res) => {
	const { id } = req.params

	if (!ObjectID.isValid(id)) {
		return res.status(404).json({ error: 'Invalid ID' })
	}

	Post.findOne({
		_id: id,
		_creator: res.user._id
	}).then(post => {
		if (!post) {
			return res.status(400).json({ error: 'Unable to find that post' })
		}

		return res.status(200).json(Post)
	}).catch(() => res.status(400).json({ error: 'Something went wrong' }))
})

router.delete('/:id', authenticate, (req, res) => {
	const { id } = req.params

	if (!ObjectID.isValid(id)) {
		return res.status(404).send('Invalid ID')
	}

	return Post.findOneAndRemove({ _id: id, _creator: res.user._id })
		.then(post => {
			if (!post) {
				return res.status(400).json({ error: 'Unable to delete that post' })
			}
			return res.status(200).json({ error: 'Post has been removed successfully!' })
		}).catch(() => res.status(400).send({ error: 'Something went wrong' }))
})

router.patch('/:id', authenticate, (req, res) => {
	const { id } = req.params
	const body = _.pick(req.body, ['title', 'description'])

	if (!ObjectID.isValid(id)) {
		return res.status(404).json({ error: 'Invalid ID' })
	}

	return Post.findOneAndUpdate({ _id: id, _creator: res.user._id }, { $set: body }, { new: true })
		.then(post => {
			if (!post) {
				return res.status(404).json({ error: 'Unable to update that post' })
			}
			return res.status(200).json(post)
		})
		.catch(() => res.status(400).send({ error: 'Something went wrong' }))
})

module.exports = router
