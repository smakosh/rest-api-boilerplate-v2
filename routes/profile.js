const express = require('express')

const router = express.Router()
const { authenticate } = require('../middleware/authenticate')

const Profile = require('../models/profile')
const User = require('../models/user')

router.get('/', authenticate, (req, res) => {
	Profile.findOne({ user: res.user._id })
		.populate('user', ['firstName', 'lastName', 'username', 'type'])
		.then(profile => {
			if (!profile) {
				const error = 'There is no profile for this user'
				return res.status(404).json({ error })
			}
			return res.status(200).json(profile)
		})
		.catch(err => res.status(400).json(err))
})

router.post('/', authenticate, (req, res) => {
	const { firstName, lastName, type, handle } = req.body
	const profileFields = {
		firstName,
		lastName,
		type
	}
	return Profile.findOne({ user: res.user._id })
		.then(profile => {
			if (profile) {
				Profile.findOneAndUpdate(
					{ user: res.user._id },
					{ $set: profileFields },
					{ new: true }
				).then(() => res.json(profile))
			} else {
				Profile.findOne({ handle })
					.then(() => {
						if (profile) {
							return res.status(400).json({ error: 'That handle already exists' })
						}

						return new Profile(profileFields).save()
							.then(() => res.json(profile))
					})
			}
		})
})

router.delete('/', authenticate, (req, res) => {
	Profile.findOneAndRemove({ user: res.user._id })
		.then(() => {
			User.findOneAndRemove({ _id: res.user._id })
				.then(() => res.json({ success: true }))
		})
})
