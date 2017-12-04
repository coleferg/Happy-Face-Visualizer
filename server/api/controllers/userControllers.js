const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

require("../models/songModels.js");
require("../models/userModels.js");
const BCRYPT_COST = 11;
const Song = mongoose.model('Song');
const User = mongoose.model('User');

const STATUS_USER_ERROR = 422;

const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

const newUser = (req, res) => {
  const { username, password } = req.body;
  let passwordHashed = '';
  if (!password || !username) {
    res.status(STATUS_USER_ERROR).json({ error: "must provide a username and password" });
    return;
  }
  bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
    if (err) {
      res.status(STATUS_USER_ERROR).json(err);
      return;
    }
    passwordHashed = hash;
    const user = new User({ username, passwordHash: passwordHashed });
    user.save()
      .then((usery) => {
        res.json(usery);
      })
      .catch((err) => {
        res.status(STATUS_USER_ERROR);
        res.json(err);
      });
  })
  return;
};

const loginUser = (req, res) => {
  const { username, password } = req.body;
  if (!password || !username) {
    res.status(STATUS_USER_ERROR).json({ error: "must provide a username and password" });
    return;
  }
  User.findOne({ username })
    .exec()
    .then((userBack) => {
      bcrypt.compare(password, userBack.passwordHash).then(function(isValid) {
        if (!isValid) {
          res.status(STATUS_USER_ERROR).json({ error: 'invalid password'});
          return;
        }
        // sesh.user = userBack.username;
        res.json(userBack);
      });
    })
    .catch((err2) => {
      res.status(STATUS_USER_ERROR).json({ error: 'Username was not found'})
      return;
    });
  return;
};

module.exports = {
  newUser,
  loginUser
};