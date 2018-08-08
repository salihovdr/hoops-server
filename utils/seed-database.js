
const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');

const Court = require('../models/court');
const Event = require('../models/event');
const User = require('../models/user');

const seedCourts = require('../db/seed/courts.json');
const seedEvents = require('../db/seed/events.json');
const seedUsers = require('../db/seed/users.json');

console.log(`Connecting to mongodb at ${MONGODB_URI}`);
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.info('Dropping Database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([

      Court.insertMany(seedCourts),

      Event.insertMany(seedEvents),
      Event.createIndexes(),
      
      User.insertMany(seedUsers),
      User.createIndexes()

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
