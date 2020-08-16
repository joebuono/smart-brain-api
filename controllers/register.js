const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;

  // if any of these are empty, send error, don't insert into database
  if (!email || !name || !password) {
    return res.status(400).json('Incorrect form submission');
  }

  // synchronous hashing
  const hash = bcrypt.hashSync(password);
    // you create a transaction when you have to do more than two things at once
    // with knex, you use the 'trx' object instead of the db to do these operations
    // a transaction will help keep the various tables in the database consistent
    // for example, if it fails at inserting the info into the login table, it will not insert the info into the users table
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        // insert user into database
        return trx('users')
        .returning('*') // returns the user you just added
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0]);
        })
      })
      // to make sure these changes get added, you have to use trx.commit
      .then(trx.commit)
      // in case of any errors, rollback
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
  handleRegister: handleRegister
};
