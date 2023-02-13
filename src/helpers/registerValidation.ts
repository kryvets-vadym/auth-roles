import validator from 'validator';
import { RequestData } from '../types/RequestData';
import { Errors } from '../types/Errors';

export const validateRegisterInput = (data: RequestData) => {
  const errors: Errors = {};

  if (data.email === undefined) {
    errors.email = 'Email field can not be empty!';
  } else if (validator.isEmpty(data.email)) {
    errors.email = 'Email field can not be empty!';
  } else if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid, please enter a valid email address!';
  }


  if (data.password === undefined) {
    errors.password = 'Password field can not be empty!';
  } else if (validator.isEmpty(data.password)) {
    errors.password = 'Password field can not be empty!';
  } else if (!validator.isLength(data.password, { min: 6, max: 32 })) {
    errors.password = 'Password must be between 6 and 32 characters long!';
  }

  if (data.username === undefined) {
    errors.username = 'Name field can not be empty!';
  } else if (validator.isEmpty(data.username)) {
    errors.username = 'Name field can not be empty!';
  } else if (!validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = 'Name must be between 2 and 30 characters long!';
  }

  return {
    errors,
    isValid: !Object.keys(errors).length,
  };
};
