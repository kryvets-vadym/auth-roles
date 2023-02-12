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
    boss: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    subordinates: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
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
