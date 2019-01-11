const users = require('./app/common/users');

users.getUser({ username: process.env.USERNAME }, false, (err, user) => {
  if (!err) {
    console.error(`User ${user.username} found.`); console.error(`User ${user.username} already exists.`);
    return;
  }
  console.error(err);
  if (!process.env.PASSWORD) {
    console.error('Bad password'); console.error('No Password! You must provide one to setup an account!');
  } else {
    users.addUser({
      username: process.env.USERNAME,
      password: process.env.PASSWORD
    }, (err) => {
      if (err) { console.error(err); return; }
      console.log('Done!');
    });
  }
});
