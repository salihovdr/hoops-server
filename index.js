
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

const courtsRouter = require('./routes/courts');
const eventsRouter = require('./routes/events');

//added this line temporarily
// const Event = require('./models/event');

const app = express();


// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', { skip: (req, res) => process.env.NODE_ENV === 'test'}));

//CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(cors({origin: CLIENT_ORIGIN}));

app.use(express.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/courts', courtsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
// app.use('/api/protected/events', eventsRouter);

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true }); //added failWithError: true

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  console.log(err);
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
