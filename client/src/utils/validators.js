import equals from "validator/lib/equals";
import isEmail from "validator/lib/isEmail";
import isEmpty from "validator/lib/isEmpty";
import isLength from "validator/lib/isLength";

export function loginErrors(login, password) {
  const errors = {};

  if (isEmpty(login, { ignore_whitespace: true })) {
    errors.login = "Username or Email cannot be empty";
  }

  if (isEmpty(password, { ignore_whitespace: true })) {
    errors.password = "Password cannot be empty";
  }

  return Object.keys(errors).length === 0 ? false : errors;
}

export function registerErrors(email, username, password, password2) {
  const errors = {};

  if (isEmpty(email, { ignore_whitespace: true })) {
    errors.email = "Email cannot be empty";
  }

  if (isEmpty(username, { ignore_whitespace: true })) {
    errors.username = "Username cannot be empty";
  }

  if (isEmpty(password, { ignore_whitespace: true })) {
    errors.password = "Password cannot be empty";
  }

  // Return errors if at least one field is empty
  if (Object.keys(errors).length > 0) {
    return errors;
  }

  if (!isEmail(email)) {
    errors.email = "Email is invalid";
  }

  if (!isLength(username, { min: 1, max: 15 })) {
    errors.username = "Username should be between 1 and 15 characters";
  }

  // Return errors if at least one of the previous field has issues
  if (Object.keys(errors).length > 0) {
    return errors;
  }

  if (!/^[0-9a-zA-Z_+-.!#$'^`~@]+$/.test(username)) {
    errors.username =
      "Username can only contain alphanumeric characters and the following characters: '_', '+', '-', '.', '!', '#', '$', ''', '^', '`', '~' and '@'";
  }

  if (!equals(password, password2)) {
    errors.password = "Passwords do not match";
    errors.password2 = "Passwords do not match";
  }
  
  return Object.keys(errors).length === 0 ? false : errors;
}
