const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    availableBalance: {
      type: Number,
      default: 500.0, // Initialize all user balance with 500 units
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Wallet', WalletSchema);
