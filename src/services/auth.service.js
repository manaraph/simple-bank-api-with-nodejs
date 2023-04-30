const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'secret';

const issueToken = (payload) => jwt.sign(payload, secret);

module.exports = {
  issueToken,
};
