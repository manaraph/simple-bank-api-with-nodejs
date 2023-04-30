const bcrypt = require('bcrypt-nodejs');

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

module.exports = {
  hashPassword,
};
