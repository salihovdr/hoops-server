const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
  rating: 
  [
    { type: Number, 
      default: 3,
      author: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        username: String
      }
    }
  ]
});

// Add `createdAt` and `updatedAt` fields
ratingSchema.set('timestamps', true);

module.exports = mongoose.model('Rating', ratingSchema);