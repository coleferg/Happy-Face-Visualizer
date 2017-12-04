const mongoose = require('mongoose');

require("../models/songModels.js");
require("../models/userModels.js");

const Song = mongoose.model('Song');
const User = mongoose.model('User');

const STATUS_USER_ERROR = 422;

const newSong = (req, res) => {
  const { songURL, title, voxURL, creator } = req.body;
  if (!songURL || !title || !voxURL || !creator) {
    res.status(STATUS_USER_ERROR)
    res.json({ error: "You might be signed in and provide a title, vocal track URL, and main song URL"})
  }
  let id = creator;
  const song = new Song({ creator: id, title, songURL, voxURL });
  song.save()
    .then((songBack) => {
      res.json(songBack)
    })
    .catch((err) => {
      res.status(STATUS_USER_ERROR);
      res.json(err);
    });
};

const getSongs = (req, res) => {
  const { id } = req.params
  Song.find({ creator: id })
    .populate()
    .exec()
    .then((allSongs) => {
      let modifiedSongs = allSongs.map((song) => {
        return { title: song.title, id: song._id, songURL: song.songURL, voxURL: song.voxURL }
      })
      res.json(modifiedSongs);
    })
    .catch((err) => {
      res
        .status(STATUS_USER_ERROR)
        .json(err);
    });
};

const getSong = (req, res) => {
  const { id } = req.params;
  Song.findById(id)
    .exec()
    .then((song) => {
      res.json(song);
    })
    .catch((err) => {
      res
        .status(STATUS_USER_ERROR)
        .json(err);
    })
};

const editMIDI = (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  Song.findById(id)
    .populate()
    .exec()
    .then((song) => {
      console.log(song)
      song.data = data;
      song.save()
        .then((songBack) => {
          console.log(songBack)
          res.json(songBack)
        })
        .catch((err) => {
          console.log(err)
          res.status(STATUS_USER_ERROR);
          res.json(err);
        });
    })
    .catch(err => {
      res
        .status(STATUS_USER_ERROR)
        .json(err);
    })
};

module.exports = {
    newSong,
    getSongs,
    getSong,
    editMIDI
  };