import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Create the User Schema
const UserSchema = new Schema({
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
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
UserSchema.index({ email: 1 });
UserSchema.plugin(AutoIncrement, { inc_field: 'userId' }); // Auto increment id

const User = mongoose.model('User', UserSchema);

export default User;
