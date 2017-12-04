const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/songs', { useMongoClient: true });


const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  songURL: {
    type: String,
    required: true
  },
  voxURL: {
    type: String,
    required: true
  },
  creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  data: {
    type: Array
  }
});


module.exports = mongoose.model('Song', SongSchema);
