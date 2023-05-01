const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const { APIResponse, APIFatalResponse } = require('../utils/response');

const secret = process.env.JWT_SECRET || 'secret';

const issueToken = (payload) => jwt.sign(payload, secret);

const authenticateUser = (req, res, next) => {
  const bearerToken = req.headers['authorization'];
  if (typeof bearerToken !== 'undefined') {
    jwt.verify(bearerToken, secret, (err) => {
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
      message: 'Access denied',
    };
    return APIResponse(res, data, httpStatus.FORBIDDEN);
  }
};

const authorizeAdmin = (req, res, next) => {
  const bearerToken = req.headers['authorization'];
  if (typeof bearerToken !== 'undefined') {
    jwt.verify(bearerToken, secret, (err, data) => {
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
      message: 'Access denied',
    };
    return APIResponse(res, data, httpStatus.FORBIDDEN);
  }
};

module.exports = {
  issueToken,
  authenticateUser,
  authorizeAdmin,
};
