require('dotenv').config()

module.exports = {
	MONGO_URI: process.env.DB,
	secret_key: process.env.SECRET_KEY
}
