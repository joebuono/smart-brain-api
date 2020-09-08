const Clarifai = require('clarifai');

// How to manage secrets? SSH keys, tokens, passwords, API keys, etc
// Usually people set an environmental variable
// At the end of the day, your code is always being run inside an operating system
// process.env.NODE_ENV is the environment
const app = new Clarifai.App({
  apiKey: '852cd1809be6476aac272b038fa73d52'
 });

// API key
// 852cd1809be6476aac272b038fa73d52

// For the sake of security and not exposing our API key to the public, 
// we're doing the API call on the server
// Request the menu item in exactly the right way
// *** An API is a description of the communication requirements ***
// An API is the menu, not the waiter
// If you want this info, then you have to make this API call/request in exactly this way
// If you send this to us in this way, we'll send info back to you
// It's how you actually do the communication
// How to order something from a menu
const handleApiCall = (req, res) => {
  app.models
    // This part has been updated with the recent Clarifai changed. Used to be:
    // .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .predict('c0c0ac362b03416da06ab3fa36fb58e3', req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}


const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('Unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall
}

