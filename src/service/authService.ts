import User from '../models/User';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 }  from 'uuid';
import * as mailService from './mailService';
import * as tokenService from './tokenService';
import { UserToReturn } from '../types/UserToReturn';
import { ApiError } from '../exceptions/apiError';
import { UserRoles } from '../types/UserRoles';

export const registration = async (
  email: string,
  name: string,
  password: string,
  role: UserRoles,
  boss: any,
) => {
  const candidate = await User.findOne({ email });

  if (candidate) {
    throw ApiError.BadRequest('A user with this email already exists!');
  }

  const hashedPassword = bcrypt.hashSync(password, 7);
  const activationLink = uuidv4();

  const user = new User({
    username: name,
    email,
    password: hashedPassword,
    activationLink,
  });

  if (role) {
    user.role = role;
  }

  if (boss) {
    user.boss = boss;
  }

  await user.save();
  // await mailService.sendActivationMail(
  //   email,
  //   `${process.env.API_URL}/auth/activate/${activationLink}`
  // );

  const userDto: UserToReturn = { ...user.toJSON() };
  delete userDto.password;

  if (boss) {
    const userBoss: any = await User.findById(boss);
    userBoss.role = UserRoles.Boss;
    userBoss.subordinates.push(userDto._id);
    await userBoss.save();
  }

  const tokens = tokenService.generateTokens(userDto);

  await tokenService.saveToken(userDto._id, tokens.refreshToken);
  return { ...tokens, userDto };
}

export const activate = async (activationLink: string) => {
  const user = await User.findOne({ activationLink });

  if (!user) {
    throw ApiError.BadRequest('Incorrect activation link!');
  }

  user.isActivated = true;
  await user.save();
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw ApiError.BadRequest('No user with this email was found!');
  }

  const isPassEquals = await bcrypt.compare(password, user.password);

  if (!isPassEquals) {
    throw ApiError.BadRequest('Incorrect password entered!');
  }

  const userDto: UserToReturn = { ...user.toJSON() };
  delete userDto.password;

  const tokens = tokenService.generateTokens(userDto);
  await tokenService.saveToken(userDto._id, tokens.refreshToken);

  return { ...tokens, userDto};
}

export const logout = async (refreshToken: string) => {
  const token = await tokenService.removeToken(refreshToken);

  return token;
}

export const refresh = async (refreshToken: string) => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }

  const userData = tokenService.validateRefreshToken(refreshToken);
  const tokenFromDb = await tokenService.findToken(refreshToken);

  if (!userData || !tokenFromDb) {
    throw ApiError.UnauthorizedError();
  }

  const user = await User.findById(userData);

  if (!user) {
    throw ApiError.UnauthorizedError();
  }

  const userDto: UserToReturn = { ...user.toJSON() };
  delete userDto.password;

  const tokens = tokenService.generateTokens(userDto);
  await tokenService.saveToken(userDto._id, tokens.refreshToken);

  return { ...tokens, userDto};
};

export const getAllUsers = async (user: any) => {
  const { role } = user;
  const currUser: any = await User.findById(user._id);
  let usersToReturn;

  switch (role) {
    case UserRoles.Admin:
      const users = await User.find();

      usersToReturn = users.map(user => {
        const newUser: UserToReturn = { ...user.toJSON() };
        delete newUser.password;

        return newUser;
      });

      return usersToReturn;

    case UserRoles.User:

      if (!currUser) {
        throw ApiError.NotFound();
      }

      const userToReturn: UserToReturn = { ...currUser.toJSON() };
      delete userToReturn.password;

      return userToReturn;

    case UserRoles.Boss:
      const subordinates = await User.find({
        boss: currUser.id,
      });

      usersToReturn = [currUser, ...subordinates];

      const resultUsersList = usersToReturn.map(user => {
        const newUser: UserToReturn = { ...user.toJSON() };
        delete newUser.password;

        return newUser;
      });

      return resultUsersList;
  }
}
