const songMethods = require('../controllers/songControllers');
const userMethods = require('../controllers/userControllers');

module.exports = (app) => {
  app
    .route('/new-user')
    .post(userMethods.newUser);

  app
    .route('/login')
    .post(userMethods.loginUser);

  app
    .route('/new-song')
    .post(songMethods.newSong);

  app
    .route('/:id/songs')
    .get(songMethods.getSongs);

  app
    .route('/song/:id')
    .get(songMethods.getSong)
    .put(songMethods.editMIDI);
};
