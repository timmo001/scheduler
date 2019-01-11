const Datastore = require('nedb'),
  bcrypt = require('bcryptjs');

const db = new Datastore({ filename: process.env.USERS_DB_PATH || 'users.db', autoload: true });

const getUser = (user, passwordReq = false, cb) => {
  db.findOne({ username: user.username }, (err, doc) => {
    if (err) { cb(err); return; }
    if (!doc) { cb(`No user found for ${user.username}.`); return; }
    if (passwordReq)
      bcrypt.compare(user.password, doc.password, (err, res) => {
        err ? cb(err) :
          !res ? cb('Incorrect password.')
            : cb(null, doc);
      });
    else cb(null, doc);
  });
};

const addUser = (user, cb) => {
  bcrypt.hash(user.password, 10, (err, hash) => {
    err ? cb(err) :
      db.insert({ username: user.username, password: hash },
        (err, newDoc) => err ? cb(err) : cb(null, newDoc)
      );
  });
};

const addJob = (job, cb) => {
  db.insert
};



module.exports = {
  getUser,
  addUser,
  addJob
};
