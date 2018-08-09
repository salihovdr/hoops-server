
const express = require('express');
//const passport = require('passport');
//const mongoose = require('mongoose');
const Court = require('../models/court');
const router = express.Router();

//router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

// function validateCourtId(id) {
//   return Court.count({ _id: id })
//     .then(count => {
//       if (count === 0) {
//         const err = new Error('The `courtId` doesn\'t exist');
//         err.status = 404;
//         return Promise.reject(err);
//       }
//     });
// }

//GET all
router.get('/', (req, res, next) => {
  const { /*name,*/ zip }= req.query;
  

  let filter = {};

  if (zip) {
    filter['address.zip'] = zip;
  }

  // if (name) {
  //   const n = new RegExp(name, 'i');
  //   filter.name = n;
  // }

  Court.find(filter)
    .populate('events')
    .then(courts => {
      res.json(courts);
    })
    .catch(err => {
      next(err);
    });
});

//GET by Id
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  Court.findById(id)
    .populate({
      path: 'events',
      populate: { path: 'authorId', select: 'username' }
    })
    .then(court => {
      if(court){
        res.json(court);
      } else {
        next();
      }
    })
    .catch(err => next(err));
}
);

module.exports = router;