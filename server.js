const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// Importing the functions that handle the different routes (in the controllers folder)
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1', // this is localhost (home)
    user : 'joebuono', // there's not really a user
    password : '',
    database : 'smart-brain'
  }
});

const app = express();

// What exactly is middleware?
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(database.users);
})

// Oooh this is sleek
// handleSignin is a function that returns a function that takes req and res params (see signin.js), and then the req and res params are passed into the returned function
// wow, higher order functions!
app.post('/signin', signin.handleSignin(db, bcrypt));

// this is called "dependency injection"
// we're injecting whatever dependencies this handleSignin function needs
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)});

// a possible endpoint for a profile page for each user
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db)});

app.put('/image', (req, res) => { image.handleImage(req, res, db)});

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)});


app.listen(3000, () => {
  console.log('app is running on port 3000');
})



/*
Creating different endpoints:
/ --> res = this is working (root route)
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user (count)



Build your server, test with Postman, and then, only at the end once everything is working, connect with the frontend. 

Ohhh wait a second...
- Postman is like a pretend front end. 



*/

/*

  // for encrytion:
  // bcrypt.compare(password, hash, function(err, res) {
  //   //
  // });
  // bcrypt.compare(password, hash, function(err, res) {
  //   //
  // });



  bcrypt.hash(password, null, null, function(err, hash) {
    console.log(hash);
  });

*/
