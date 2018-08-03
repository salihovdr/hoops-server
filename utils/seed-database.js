'use strict';

const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');

const Cheese = require('../models/cheese');

const seedCheeses = require('../db/seed/cheeses.json');

console.log(`Connecting to mongodb at ${MONGODB_URI}`);
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.info('Dropping Database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([

      Cheese.insertMany(seedCheeses),

    ]);
  })
  .then(() => {
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
