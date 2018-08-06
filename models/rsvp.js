const mongoose = require('mongoose');

const rsvpSchema = mongoose.Schema({
  attending: Boolean,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  event: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
});

// Add `createdAt` and `updatedAt` fields
rsvpSchema.set('timestamps', true);

module.exports = mongoose.model('RSVP', rsvpSchema);