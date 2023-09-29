const httpStatus = require('http-status');
const { APIResponse, APIFatalResponse } = require('../utils/response');
const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');
// const { startSession } = require('mongoose');

const initiatePayment = async (req, res) => {
  // const session = await startSession();

  try {
    const {
      body: { receiverId, amount },
      user,
    } = req;
    if (!user) {
      const data = {
        message: 'Failed: Invalid user',
      };
      return APIResponse(res, data, httpStatus.UNPROCESSABLE_ENTITY);
    }

    const accountDetails = await Wallet.findOne({ userId: user._id });

    if (amount > accountDetails.availableBalance) {
      const data = {
        message: 'Failed: Insufficient fund',
      };
      return APIResponse(res, data, httpStatus.UNPROCESSABLE_ENTITY);
    }

    senderDebited = await Wallet.findOneAndUpdate(
      { userId: user._id },
      {
        $inc: {
          availableBalance: -parseFloat(amount),
        },
      }
    );

    if (!senderDebited) {
      const transaction = new Transaction({ senderId: user._id, receiverId, amount, status: 'FAILED' });
      await transaction.save();

      const data = {
        message: 'Failed: Sender not debited',
      };
      return APIResponse(res, data, httpStatus.UNPROCESSABLE_ENTITY);
    }

    const transaction = new Transaction({ senderId: user._id, receiverId, amount });
    const transactionDetails = await transaction.save();

    if (!transactionDetails) {
      const data = {
        message: 'Failed: Transaction not recorded',
      };
      return APIResponse(res, data, httpStatus.UNPROCESSABLE_ENTITY);
    }

    receiverCredited = await Wallet.findOneAndUpdate(
      { userId: receiverId },
      {
        $inc: {
          availableBalance: parseFloat(amount),
        },
      }
    );

    if (!receiverCredited) {
      const data = {
        message: 'Failed: Receiver not credited',
      };
      return APIResponse(res, data, httpStatus.UNPROCESSABLE_ENTITY);
    }

    const statusUpdated = await Transaction.findOneAndUpdate({ _id: transaction._id }, { status: 'SUCCESS' });

    if (!statusUpdated) {
      const data = {
        message: 'Failed: Transaction not updated',
      };
      return APIResponse(res, data, httpStatus.UNPROCESSABLE_ENTITY);
    }

    return APIResponse(
      res,
      {
        message: 'Transaction successful',
      },
      httpStatus.OK
    );
  } catch (error) {
    return APIFatalResponse(res, error);
  }
};

module.exports = { initiatePayment };
