const httpStatus = require('http-status');
const { APIResponse, APIFatalResponse } = require('../utils/response');
const { getAuthenticatedUser } = require('../services/auth.service');
const User = require('../models/user.model');
// const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');

const initiatePayment = async (req, res) => {
  try {
    const {
      body: { receiverId, amount },
      user,
    } = req;
    // Wallet.updateOne(
    //   { userId: user._id },
    //   {
    //     $inc: {
    //       availableBalance: -parseFloat(amount),
    //     },
    //   },
    //   { upsert: true }
    // )
    if (!user) {
      const data = {
        message: 'Failed: Invalid user',
      };
      return APIResponse(res, data, httpStatus.UNPROCESSABLE_ENTITY);
    }
    const transactionDetails = { senderId: user._id, receiverId, amount };
    const transaction = new Transaction(transactionDetails);
    await transaction.save();

    return APIResponse(
      res,
      {
        message: 'success',
        data: transactionDetails,
      },
      httpStatus.OK
    );
  } catch (error) {
    return APIFatalResponse(res, error);
  }
};

module.exports = { initiatePayment };
