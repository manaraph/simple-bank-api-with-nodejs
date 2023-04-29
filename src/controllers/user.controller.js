const httpStatus = require('http-status');
const APIResponse = require('../utils/response');
const APIResponse = require('../utils/response');
const { validateEmail, generatePassword } = require('../utils/utils');
const User = require('../models/user.model');

const createUser = async (req, res) => {
  try {
    const { body } = req;
    const isEmailValid = validateEmail(body.email);

    if (!isEmailValid) {
      const data = {
        message: 'Invalid Email',
      };
      return APIResponse(res, data, httpStatus.UNPROCESSABLE_ENTITY);
    }

    const userExists = await User.findOne({ email: body.emal });
    if (userExists) {
      const data = {
        message: err ? 'An error occurred' : 'This email already exists',
      };
      return APIResponse(res, data, httpStatus.UNPROCESSABLE_ENTITY);
    }

    const password = generatePassword();
    body.role = body.role.toUpperCase();
    body.password = bcrypt.hashSync(password, 10);

    const user = new User(body);

    const newUser = await user.save();

    // You can delete the password from the response and send it via sms or email
    // delete newUser.password;

    return APISuccess(
      res,
      {
        message: 'User created successfully',
        response: newUser,
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

export { createUser };
