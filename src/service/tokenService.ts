import jwt from 'jsonwebtoken';
import Token from '../models/Token';
import { UserToReturn } from '../types/UserToReturn';
import { ApiError } from "../exceptions/apiError";

export const generateTokens = (payload: UserToReturn) => {
  const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

  if (!JWT_REFRESH_SECRET || !JWT_ACCESS_SECRET) {
    throw ApiError.NotFound();
  }

  const accessToken = jwt.sign(
    payload,
    JWT_ACCESS_SECRET,
    { expiresIn: '30m'}
  );

  const refreshToken = jwt.sign(
    payload,
    JWT_REFRESH_SECRET,
    { expiresIn: '30d'}
  );

  return {
    accessToken,
    refreshToken,
  }
}

export const validateAccessToken = (token: string) => {
  try {
    const { JWT_ACCESS_SECRET } = process.env;

    if (!JWT_ACCESS_SECRET) {
      return null;
    }

    const userData = jwt.verify(token, JWT_ACCESS_SECRET);

    return userData;
  } catch (err) {
    return null;
  }
};

export const validateRefreshToken = (token: string) => {
  try {
    const { JWT_REFRESH_SECRET } = process.env;

    if (!JWT_REFRESH_SECRET) {
      return null;
    }

    const userData = jwt.verify(token, JWT_REFRESH_SECRET);

    return userData;
  } catch (err) {
    return null;
  }
};

export const saveToken = async (userId: any, refreshToken: any) => {
  const tokenData = await Token.findOne({ user: userId });

  if (tokenData) {
    tokenData.refreshToken = refreshToken;

    return tokenData.save();
  }

  const token = await Token.create({ user: userId, refreshToken });

  return token;
}

export const removeToken = async (refreshToken: string) => {
  const tokenData = await Token.deleteOne({ refreshToken });

  return tokenData;
};

export const findToken = async (refreshToken: any) => {
  const tokenData = await Token.findOne({ refreshToken });

  return tokenData;
};
