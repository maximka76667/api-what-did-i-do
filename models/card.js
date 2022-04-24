const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    validate: {
      validator: (date) => date.match(/\d{1,2}-\d{1,2}-\d{4}/),
    },
  },
  points: {
    type: [{
      name: {
        type: String,
        required: true,
      },
      description: String,
    }],
    required: true,
    default: [],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  versionKey: false,
});

module.exports = mongoose.model('card', cardSchema);
