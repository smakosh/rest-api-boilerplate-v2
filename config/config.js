require('dotenv').config()

module.exports = {
	DB: process.env.DB,
	secret_key: process.env.SECRET_KEY,
	allowed_url: process.env.REACT_APP_URL
}
