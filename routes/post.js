const express = require('express')
const _ = require('lodash')
const { ObjectID } = require('mongodb')
const { authenticate } = require('../middleware/authenticate')
const { Post } = require('../models/post')

const router = express.Router()

router.post('/', authenticate, async (req, res) => {
	try {
		const post = new Post({
			title: req.body.title,
			description: req.body.description,
			_creator: res.user._id
		})
		const doc = await post.save()

		res.status(200).json(doc)
	} catch (err) {
		res.status(400).send({ error: 'Something went wrong' })
	}
})

router.get('/all', authenticate, async (_req, res) => {
	try {
		const posts = await Post.find({ _creator: res.user._id })

		res.status(200).json(posts)
	} catch (err) {
		res.status(400).json({ error: 'This user has no posts added' })
	}
})

router.get('/:id', authenticate, async (req, res) => {
	try {
		const { id } = req.params

		if (!ObjectID.isValid(id)) {
			return res.status(404).json({ error: 'Invalid ID' })
		}

		const post = await Post.findOne({ _id: id, _creator: res.user._id })
		res.status(200).json(post)
	} catch (err) {
		res.status(400).json({ error: 'Unable to find that post' })
	}
})

router.delete('/:id', authenticate, async (req, res) => {
	try {
		const { id } = req.params

		if (!ObjectID.isValid(id)) {
			return res.status(404).send('Invalid ID')
		}

		const post = await Post.findOneAndRemove({ _id: id, _creator: res.user._id })

		if (!post) {
			return res.status(400).json({ error: 'Unable to delete that post' })
		}

		res.status(200).json({ error: 'Post has been removed successfully!' })
	} catch (err) {
		res.status(400).send({ error: 'Something went wrong' })
	}
})

router.patch('/:id', authenticate, async (req, res) => {
	try {
		const { id } = req.params
		const body = _.pick(req.body, ['title', 'description'])

		if (!ObjectID.isValid(id)) {
			return res.status(404).json({ error: 'Invalid ID' })
		}
		const post = await Post.findOneAndUpdate({
			_id: id,
			_creator: res.user._id
		}, { $set: body }, { new: true })

		if (!post) {
			return res.status(404).json({ error: 'Unable to update that post' })
		}

		res.status(200).json(post)
	} catch (err) {
		res.status(400).send({ error: 'Something went wrong' })
	}
})

module.exports = router
