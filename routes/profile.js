const express = require('express')
const { authenticate } = require('../middleware/authenticate')
const Profile = require('../models/profile')
const User = require('../models/user')

const router = express.Router()

router.get('/', authenticate, async (_req, res) => {
	try {
		const profile = await Profile.findOne({ user: res.user._id }).populate('user', ['firstName', 'lastName', 'username', 'type'])
		if (!profile) {
			const error = 'There is no profile for this user'
			return res.status(404).json({ error })
		}
		return res.status(200).json(profile)
	} catch (err) {
		res.status(400).json({ error: 'something went wrong' })
	}
})

router.post('/', authenticate, async (req, res) => {
	const { firstName, lastName, type, handle } = req.body
	const profileFields = {
		firstName,
		lastName,
		type
	}

	try {
		const profile = await Profile.findOne({ user: res.user._id })
		if (profile) {
			await Profile.findOneAndUpdate(
				{ user: res.user._id },
				{ $set: profileFields },
				{ new: true }
			)

			res.json(profile)
		} else {
			const profileExists = await Profile.findOne({ handle })

			if (profileExists) {
				return res.status(400).json({ error: 'That handle already exists' })
			}

			await new Profile(profileFields).save()
			res.json(profile)
		}
	} catch (err) {
		res.status(502).json({ error: 'Something went wrong' })
	}
})

router.delete('/', authenticate, async (_req, res) => {
	try {
		await Profile.findOneAndRemove({ user: res.user._id })
		await User.findOneAndRemove({ _id: res.user._id })

		res.json({ success: true })
	} catch (err) {
		res.status(502).json({ error: 'Something went wrong' })
	}
})
