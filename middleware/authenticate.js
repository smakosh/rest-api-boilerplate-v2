const { User } = require('../models/user')

const authenticate = (req, res, next) => {
	const token = req.header('x-auth')

	User.findByToken(token).then(user => {
		if (!user) {
			return Promise.reject()
		}

		res.user = user
		res.token = token
		return next()
	}).catch(() => {
		res.status(401).send()
	})
}

module.exports = { authenticate }
