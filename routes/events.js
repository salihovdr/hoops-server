
const express = require('express');
const Event = require('../models/event');
const router = express.Router();

//GET all
router.get('/', (req, res, next) => {
  Event.find()
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

  const name = req.body.name;

  Event.create({ name })
    .then(newEvent => {
      res
        .status(201)
        .location(`${req.originalUrl}/${newEvent.id}`)
        .json(newEvent);
    })
    .catch(err => next(err))
}
)



module.exports = router;