const express = require('express')
const router = express.Router()
const awaitTo = require('await-to-js')
const passport = require('passport')
const authController = require('./controllers/auth')
passport.use('jwt-login', authController.jwtLogin)
passport.use('credentials-login', authController.credentialsLogin)
const reqJwt = passport.authenticate('jwt-login', { session: false })
const reqCredentials = passport.authenticate('credentials-login', { session: false })

function handleError(res, error) {
  console.log(error)
  res.status(500).json(error)
}

router.post('/auth/signin', reqCredentials, (req, res) => {
  const response = authController.signin(req.user)
  res.status(200).json(response)
})

router.post('/auth/register', authController.generatePasswordHash, async (req, res) => {
  const userdata = req.body
  const user = await authController.signup(userdata)
  res.status(200).json(user)
})

router.get('/data', reqJwt, (req, res) => {
  res.json({ 'message': 'hello' })
})

module.exports = router
