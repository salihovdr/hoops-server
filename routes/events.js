
const express = require('express');
const Event = require('../models/event');
const router = express.Router();

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

router.post('/', (req, res, next) => {
  console.log(req.body);
  const title = req.body.title;
  const description = req.body.description;
  const date = req.body.date.date;
  const time = req.body.date.time;
  const timestamp = `${ date } ${ time }`;
  console.log(timestamp);


  Event.create({ title, description, time: timestamp })
    .then(newEvent => {
      res
        .status(201)
        .location(`${req.originalUrl}/${newEvent.id}`)
        .json(newEvent);
    })
    .catch(err => next(err));
}
);

module.exports = router;