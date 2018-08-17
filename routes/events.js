
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const Event = require('../models/event');
const Court = require('../models/court');

const router = express.Router();

//GET all
router.get('/', (req, res, next) => {
  let page = req.query.page || 0;
  let date = new Date();

  //don't get old events
  //sort events by date
  Event.find({time: {
    $gte: date}})
    .sort({time: +1})
    .limit(5).skip(page * 5)
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
    .populate('courtId', 'name')
    .populate('userId', 'username')
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
  let court;
  Court.findById(courtId)
    .then(_court => {
      court = _court;
      return Event.create(newEvent);
    })
    .then(event => {
      court.events.push(event);
      court.save();
      res
        .location(`${req.originalUrl}/${event.id}`)
        .status(201)
        .json(event);
    })
    .catch(err => {
      next(err);
    });
});

router.put('/:id', passport.authenticate('jwt', { session: false, failWithError: true }), (req, res, next) => {
  const eventId = req.params.id;
  const { title, description, courtId } = req.body;
  const date = req.body.timestamp.date;
  const time = req.body.timestamp.time;
  const timestamp = `${date} ${time}`;

  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const updatedEvent = { title, description, time: timestamp, userId, courtId };
  
  Event.findByIdAndUpdate(eventId, updatedEvent, {new: true})
    .then(result => {
      res
        .location(`${req.originalUrl}/${result.id}`)
        .status(200)
        .json(result);
    })
    .catch(err => {
      next(err);
    });
});

router.delete('/:id', passport.authenticate('jwt', 
  { session: false, failWithError: true }), (req, res, next) => {
  const eventId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Event.findByIdAndRemove(eventId)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;