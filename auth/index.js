const { router } = require('../routes/auth');
const { localStrategy, jwtStrategy } = require('./strategies');

module.exports = { router, localStrategy, jwtStrategy };