const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
      trim: true,
    },
    receiverId: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
