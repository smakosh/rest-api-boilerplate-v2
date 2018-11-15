const { User } = require('../models/user')

const authenticate = async (req, res, next) => {
	try {
		const token = req.header('x-auth')
		const user = await User.findByToken(token)
		res.user = user
		res.token = token
		return next()
	} catch (err) {
		res.status(401).send()
	}
}

module.exports = { authenticate }
