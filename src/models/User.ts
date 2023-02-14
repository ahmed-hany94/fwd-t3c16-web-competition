import { Request } from 'express';

const UserSchemaError = {
  userIDMissing: "User's ID is missing",
  emailMissing: "User's email is missing",
  passwordMissing: "User's password is missing"
};

type UserSchema = {
  user_id: string;
  email: string;
  hash: string;
  message: string;
  error: string;
};

const User = function (reqBody: Request['body']) {
  if (!reqBody.email)
    return UserSchemaError.emailMissing as unknown as UserSchema;
  if (!reqBody.password)
    return UserSchemaError.passwordMissing as unknown as UserSchema;

  return {
    email: reqBody.email,
    hash: reqBody.password
  } as UserSchema;
};

export { User, UserSchema, UserSchemaError };
