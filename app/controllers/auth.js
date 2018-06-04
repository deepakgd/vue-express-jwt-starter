
const jwt = require('jwt-simple')
const JwtStrategy = require('passport-jwt').Strategy
const bcrypt = require('bcrypt-nodejs')
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')
const models = require('../models')
const to = require('await-to-js').to


/**
 * Generate JWT using regional admin's ID.
 *
 * @param {string} userId
 */
const tokenForUser = userId => {
  const timestamp = new Date().getTime()
  // const expiration = Math.floor(Date.now() / 1000) + (60 * 60)
  return jwt.encode({
    sub: userId,
    iat: timestamp
    // exp: expiration,
  }, process.env.JWT_SECRET)
}

// On Save Hook, encrypt password
// Before saving a model, run this function
const generatePasswordHash = (req, res, next) => {
  // generate a salt then run callback
  const data = req.body
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.log(err)
    }
    bcrypt.hash(data.password, salt, null, (err, hash) => {
      if (err) {
        console.log(err)
      }
      if (data.password) {
        data.password = hash
      }
      next()
    })
  })
}

const comparePassword = (passwordEnteredByUser, passwordInDb) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(passwordEnteredByUser, passwordInDb, (err, isMatch) => {
      if (err) { reject(err) }
      resolve(isMatch)
    })
  })
}

/**
 * User has already had their email and password auth'd
 * We just need to give them a token based on the user type
 */
const signin = user => {
  return {
    token: tokenForUser(user.id),
    user: user
  }
}

/**
  * Called when user logs in using  email and password
  * Verify this email and password, call done with the user
  * If it is the correct email and password
  * otherwise, call done with false
  */
const credentialsLogin = new LocalStrategy(async (username, password, done) => {
  let err, user, compPassword

  [err, user] = await to(models.user.findOne({ username }))

  if (err) { console.log(err) }

  [err, compPassword] = await to(comparePassword(password, user.password))

  if (err) { console.log(err) }

  if (!compPassword) {
    return done(null, false)
  } else {
    user.password = undefined
    return done(null, user)
  }
})

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: process.env.JWT_SECRET
}

/**
 *  Called when a  admin access a authorized route
 *  See if the user ID in the payload exists in our database
 *  If it does, call 'done' with that other
 *  otherwise, call done without a user object
 */
const jwtLogin = new JwtStrategy(jwtOptions, async function (payload, done) {
  let [err, user] = await to(models.user.findOne({ _id: payload.sub }, { password: 0 }))
  if (err) { console.log(err); done(err, false) }
  if (user === null) {
    return done(null, false)
  }
  return done(null, user)
})

const signup = async function (data) {
  let err, user

  [err, user] = await to(models.user.findOne({ where: { username: data.username } }))

  if (err) return Promise.reject(err)
  if (user === null) {
    [err, user] = await to(models.user.create({ username: data.username, password: data.password }))
    if (err) return Promise.reject(err)
  } else {
    return Promise.reject(new Error('error occured in signup function'))
  }

  return { user: { id: user.id, username: user.username }, token: user === null ? false : tokenForUser(user.id) }
}

module.exports = {
  jwtLogin,
  signup,
  credentialsLogin,
  comparePassword,
  generatePasswordHash,
  signin
}
