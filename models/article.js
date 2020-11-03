const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  text: {
    type: String,
    minlength: 2,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    validate: {
      validator: (v) => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?#?$/.test(v),
    },
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator: (v) => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?#?$/.test(v),
    },
    required: true,
  },
  owner: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('article', articleSchema);
