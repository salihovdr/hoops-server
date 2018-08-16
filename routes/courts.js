'use strict';

const express = require('express');
//const passport = require('passport');
//const mongoose = require('mongoose');
const Court = require('../models/court');
const router = express.Router();

//GET all courts
router.get('/', (req, res, next) => {
  const { /*name,*/ zip }= req.query;
  

  let filter = {};

  if (zip) {
    filter['address.zip'] = zip;
  }

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
      populate: { path: 'userId', select: 'username' }
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