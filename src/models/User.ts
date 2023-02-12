import { Schema, model } from 'mongoose';

const User = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'USER',
      enum: ['USER', 'ADMIN', 'BOSS'],
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    activationLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model('User', User);
