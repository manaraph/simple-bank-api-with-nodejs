const httpStatus = require('http-status');
const APIResponse = require('../utils/response');
const { validateEmail, generatePassword } = require('../utils/utils');
const { hashPassword } = require('../services/bcrypt.service');
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
    const data = {
      message: 'An error occurred',
      error,
    };
    return APIResponse(res, data, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

module.exports = { register };