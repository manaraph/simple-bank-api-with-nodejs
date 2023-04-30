const bcrypt = require('bcrypt-nodejs');

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

const comparePassword = (pw, hash) => bcrypt.compareSync(pw, hash);

module.exports = {
  hashPassword,
  comparePassword,
};
