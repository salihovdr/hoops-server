const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('../config.js');
const options = { session: false, failWithError: true };
const localAuth = passport.authenticate('local', options);
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
const router = express.Router();

function createAuthToken(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

const tokenGenerationHandler = function (req, res) {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
};

router.post('/login', localAuth, tokenGenerationHandler);

router.post('/refresh', jwtAuth, tokenGenerationHandler);

module.exports = router;