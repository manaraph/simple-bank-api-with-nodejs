const httpStatus = require('http-status');
const { APIResponse, APIFatalResponse } = require('../utils/response');
const { validateEmail, generatePassword } = require('../utils/utils');
const { hashPassword, comparePassword } = require('../services/bcrypt.service');
const { issueToken } = require('../services/auth.service');
const User = require('../models/user.model');

const register = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      const data = {
        message: 'Invalid Email',
      };
      return APIResponse(res, data, httpStatus.UNPROCESSABLE_ENTITY);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      const data = {
        message: 'This email already exists',
      };
      return APIResponse(res, data, httpStatus.UNPROCESSABLE_ENTITY);
    }

    const password = generatePassword();
    const userData = {
      username,
      email,
      role: role.toUpperCase(), // You can remove this so all new users are assigned the USER role
      password: await hashPassword(password),
    };

    const user = new User(userData);
    const newUser = await user.save();
    const userDetails = newUser.toObject();
    delete userDetails.password;

    return APIResponse(
      res,
      {
        message: 'User created successfully',
        data: userDetails,
        password, // Returns the generated password just for tests since sms/email is not used here
      },
      httpStatus.CREATED
    );
  } catch (error) {
    return APIFatalResponse(res, error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        const data = {
          message: 'User not found',
        };
        return APIResponse(res, data, httpStatus.UNPROCESSABLE_ENTITY);
      }
      if (comparePassword(password, user.password)) {
        const token = await issueToken({ user });

        return APIResponse(
          res,
          {
            message: 'login successful',
            data: {
              token,
              user,
            },
          },
          httpStatus.OK
        );
      } else {
        const data = {
          message: 'Incorrect password',
        };
        return APIResponse(res, data, httpStatus.BAD_REQUEST);
      }
    } else {
      const data = {
        message: 'Email and password is required',
      };
      return APIResponse(res, data, httpStatus.BAD_REQUEST);
    }
  } catch (error) {
    return APIFatalResponse(res, error);
  }
};

module.exports = { register, login };
