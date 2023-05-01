const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const { APIResponse, APIFatalResponse } = require('../utils/response');

const secret = process.env.JWT_SECRET || 'secret';

const issueToken = (payload) => jwt.sign(payload, secret);

const getAuthenticatedUser = (auth) => {
  let user;
  if (typeof auth !== 'undefined') {
    const bearer = auth.split(' ');
    const token = bearer[1];
    user = jwt.verify(token, (err, data) => {
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
  const bearer = auth.split(' ');
  const token = bearer[1];
  if (typeof token !== 'undefined') {
    jwt.verify(token, secret, (err) => {
      if (err) {
        const data = {
          message: 'Access denied',
          err,
        };
        return APIResponse(res, data, httpStatus.FORBIDDEN);
      } else {
        next();
      }
    });
  } else {
    const data = {
      message: 'Invalid token',
    };
    return APIResponse(res, data, httpStatus.FORBIDDEN);
  }
};

const authorizeAdmin = (req, res, next) => {
  const auth = req.headers['authorization'];
  const bearer = auth.split(' ');
  const token = bearer[1];

  if (typeof token !== 'undefined') {
    jwt.verify(token, secret, (err, data) => {
      if (err) {
        const data = {
          message: 'Access denied',
          err,
        };
        return APIResponse(res, data, httpStatus.FORBIDDEN);
      } else {
        if (data.user.role === 'ADMIN') {
          next();
        } else {
          const data = {
            message: 'Access denied',
          };
          return APIResponse(res, data, httpStatus.FORBIDDEN);
        }
      }
    });
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
