
const express = require('express');
const passport = require('passport');
const Event = require('../models/event');

const router = express.Router();
// router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

//GET all
router.get('/', (req, res, next) => {
  Event.find()
    .populate('courtId')
    .then(events => {
      res.json(events);
    })
    .catch(err => {
      next(err);
    });
});

//GET by Id
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  Event.findById(id)
    .populate('courtId')
    .then(event => {
      if (event) {
        res.json(event);
      } else {
        next();
      }
    })
    .catch(err => next(err));
}
);

//only authenticated users can create events
router.post('/', passport.authenticate('jwt', { session: false, failWithError: true }), (req, res, next) => {
  const { title, description, courtId } = req.body;
  const date = req.body.timestamp.date;
  const time = req.body.timestamp.time;
  const timestamp = `${date} ${time}`;

  const userId = req.user.id;

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const newEvent = { title, description, time: timestamp, userId, courtId };

  Event.create(newEvent)
    .then(event => {
      res
        .location(`${req.originalUrl}/${event.id}`)
        .status(201)
        .json(event);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;