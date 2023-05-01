const httpStatus = require('http-status');
const { APIResponse, APIFatalResponse } = require('../utils/response');
const { validateEmail, generatePassword } = require('../utils/utils');
const { hashPassword, comparePassword } = require('../services/bcrypt.service');
const { issueToken } = require('../services/auth.service');
const User = require('../models/user.model');

const getUsers = async (_, res) => {
  try {
    const users = await User.find();
    return APIResponse(
      res,
      {
        message: 'success',
        data: users,
      },
      httpStatus.OK
    );
  } catch (error) {
    return APIFatalResponse(res, error);
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById({ _id: userId });
    if (!user) {
      const data = {
        message: 'User not found',
      };
      return APIResponse(res, data, httpStatus.UNPROCESSABLE_ENTITY);
    }

    return APIResponse(
      res,
      {
        message: 'success',
        data: user,
      },
      httpStatus.OK
    );
  } catch (error) {
    return APIFatalResponse(res, error);
  }
};

module.exports = { getUsers, getUser };
