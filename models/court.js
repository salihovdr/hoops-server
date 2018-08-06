
const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: { 
    type: String, //Walter Reed
    required: true ,
    unique: true
  },
  photo: String, //url
  description: String, // One of the best best courts in town
  address: {
    street: {
      type: String, //1421 Glebe Rd
      required: true
    },
    city: {
      type: String, //Arlington
      required: true
    },
    zip: {
      type: String, //22201
      required: true
    },
    phone: {
      type: String, //970-234-5757
      required: false
    }
  },
  hours: [
    {
      day: [ //mon
        { 
          open: Number,     // open: 570 => hrs * mins
          required: true
        },
        {
          close: Number, // close: 1080
          required: true
        }
      ]
    }
  ],
  rating: { type: mongoose.Schema.Types.ObjectId, ref: 'Rating' },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }
  ]
});

// Customize output for `res.json(data)`, `console.log(data)` etc.
courtSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});

module.exports = mongoose.model('Court', courtSchema);
