const express = require('express')
const _ = require('lodash')
const { authenticate } = require('../middleware/authenticate')
const { User } = require('../models/user')

const router = express.Router()

router.post('/register', (req, res) => {
	const body = _.pick(req.body, ['username', 'email', 'password'])
	const user = new User(body)

	user.save()
		.then(() => user.generateAuthToken())
		.then(token => res.json({ username: user.username, token }))
		.catch(() => res.status(400).json({ error: 'Something went wrong' }))
})

router.get('/me', authenticate, (req, res) => res.json(res.user.username))

router.post('/login', (req, res) => {
	const body = _.pick(req.body, ['email', 'password'])

	User.findByCredentials(body.email, body.password).then(user => {
		return user.generateAuthToken().then(token => res.json({ username: user.username, token }))
	}).catch(() => res.status(400).send({ error: 'Wrong credentials' }))
})

router.delete('/me/token', authenticate, (req, res) => {
	res.user.removeToken(res.token).then(() => {
		res.status(200).json({ message: 'logged out' })
	}, () => {
		res.status(400).json({ error: 'could not log you out' })
	}).catch(() => res.status(502).json({ error: 'could not log you out' }))
})

module.exports = router
