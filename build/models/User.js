"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchemaError = exports.User = void 0;
const UserSchemaError = {
    userIDMissing: "User's ID is missing",
    emailMissing: "User's email is missing",
    passwordMissing: "User's password is missing"
};
exports.UserSchemaError = UserSchemaError;
const User = function (reqBody) {
    if (!reqBody.email)
        return UserSchemaError.emailMissing;
    if (!reqBody.password)
        return UserSchemaError.passwordMissing;
    return {
        email: reqBody.email,
        hash: reqBody.password
    };
};
exports.User = User;
