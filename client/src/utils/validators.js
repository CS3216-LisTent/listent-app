import isEmpty from "validator/lib/isEmpty";

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
