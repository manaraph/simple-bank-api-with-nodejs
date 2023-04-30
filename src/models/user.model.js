const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      text: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
      trim: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.index({ email: 1 });

const User = mongoose.model('User', UserSchema);

module.exports = User;
