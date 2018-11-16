const express = require('express')
const _ = require('lodash')
const { authenticate } = require('../middleware/authenticate')
const { User } = require('../models/user')

const router = express.Router()

router.post('/register', async (req, res) => {
	try {
		const body = _.pick(req.body, ['username', 'email', 'password', 'firstName', 'lastName'])
		const user = await new User(body)
		await user.save()
		const token = await user.generateAuthToken()
		res.json({ user, token })
	} catch (err) {
		res.status(400).json({ error: 'Something went wrong' })
	}
})

router.get('/verify', authenticate, async (_req, res) => {
	try {
		res.json(res.user)
	} catch (err) {
		res.status(404).json({ error: 'could not log you in' })
	}
})

router.post('/login', async (req, res) => {
	try {
		const body = _.pick(req.body, ['email', 'password'])
		const user = await User.findByCredentials(body.email, body.password)
		const token = await user.generateAuthToken()
		res.json({ user, token })
	} catch (err) {
		res.status(400).json({ error: 'Wrong credentials' })
	}
})

router.delete('/logout', authenticate, async (_req, res) => {
	try {
		await res.user.removeToken(res.token)
		res.status(200).json({ message: 'logged out' })
	} catch (err) {
		res.status(502).json({ error: 'could not log you out' })
	}
})

module.exports = router
