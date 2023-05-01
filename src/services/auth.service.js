const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const { APIResponse } = require('../utils/response');

const secret = process.env.JWT_SECRET || 'secret';

const issueToken = (payload) => jwt.sign(payload, secret);

const getAuthenticatedUser = (auth) => {
  let user;
  const bearer = auth && auth.split(' ');

  if (typeof bearer !== 'undefined' && bearer.length === 2) {
    const token = bearer[1];

    user = jwt.verify(token, secret, (err, data) => {
      if (err) {
        return {
          status: 'error',
          err,
        };
      }
      return data;
    });
  }
  return user;
};

const authenticateUser = (req, res, next) => {
  const auth = req.headers['authorization'];
  const data = getAuthenticatedUser(auth);

  if (data?.user) {
    next();
  } else {
    const data = {
      message: 'Invalid token',
    };
    return APIResponse(res, data, httpStatus.FORBIDDEN);
  }
};

const authorizeAdmin = (req, res, next) => {
  const auth = req.headers['authorization'];
  const data = getAuthenticatedUser(auth);

  if (data?.user) {
    if (data.user.role === 'ADMIN') {
      next();
    } else {
      const data = {
        message: 'Access denied',
      };
      return APIResponse(res, data, httpStatus.FORBIDDEN);
    }
  } else {
    const data = {
      message: 'Invalid token',
    };
    return APIResponse(res, data, httpStatus.FORBIDDEN);
  }
};

module.exports = {
  issueToken,
  getAuthenticatedUser,
  authenticateUser,
  authorizeAdmin,
};
