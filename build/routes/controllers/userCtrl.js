"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userByID = exports.updateUser = exports.getUsers = exports.getUser = exports.deleteUser = exports.createUser = void 0;
const db_1 = require("../../db");
const User_1 = require("../../models/User");
const createUser = async function (req, res) {
    try {
        /* Validate input & Create User */
        const user = (0, User_1.User)(req.body);
        if (!('email' in user) && !('hash' in user))
            throw new Error(user);
        const query = 'INSERT INTO "users" (email, hash) VALUES ($1, $2);';
        const operationResult = await (0, db_1.execute)(query, [
            user.email,
            user.hash
        ]);
        /* Validate database operation success */
        if ('error' in operationResult[0])
            throw new Error(operationResult[0].error);
        /* Request ended successfully */
        res.status(200).json(operationResult[0]);
    }
    catch (err) {
        if (err instanceof Error)
            res.status(400).json({
                Error: err.message
            });
        else {
            console.log(err);
            res.status(400).json({
                Error: err
            });
        }
    }
};
exports.createUser = createUser;
const userByID = async function (req, res, next, userID) {
    try {
        /* Validate input & Get User */
        if (!userID)
            throw new Error(User_1.UserSchemaError.userIDMissing);
        const query = 'SELECT user_id, email FROM "users" WHERE user_id = $1;';
        const user = await (0, db_1.execute)(query, [userID]);
        /* Validate database operation success */
        if (!('user_id' in user[0]) && !('email' in user[0]))
            throw new Error(user[0]);
        /* Pass the user to the next function */
        res.locals.profile = user[0];
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                Error: err.message
            });
        }
        else {
            console.log(err);
            return res.status(400).json({
                Error: err
            });
        }
    }
};
exports.userByID = userByID;
const getUsers = async function (req, res) {
    try {
        const query = 'SELECT * FROM "users";';
        const operationResult = await (0, db_1.execute)(query, []);
        /* Validate database operation success */
        if ('error' in operationResult[0])
            throw new Error(operationResult[0].error);
        /* Request ended successfully */
        res.status(200).json({ users: operationResult });
    }
    catch (err) {
        console.log(err);
        if (err instanceof Error)
            res.status(400).json({
                Error: err.message
            });
        else {
            console.log(err);
            res.status(400).json({
                Error: err
            });
        }
    }
};
exports.getUsers = getUsers;
const getUser = async function (req, res) {
    res.status(200).json({ user: res.locals.profile });
};
exports.getUser = getUser;
const deleteUser = async function (req, res) {
    try {
        /* Get the user passed by userByID middleware */
        const user = res.locals.profile;
        const query = 'DELETE FROM "users" WHERE user_id = $1;';
        const operationResult = await (0, db_1.execute)(query, [user.user_id]);
        /* Validate database operation success */
        if ('error' in operationResult[0])
            throw new Error(operationResult[0].error);
        /* Request ended successfully */
        res.status(200).json(operationResult[0]);
    }
    catch (err) {
        console.log(err);
        if (err instanceof Error)
            res.status(400).json({
                Error: err.message
            });
        else {
            console.log(err);
            res.status(400).json({
                Error: err
            });
        }
    }
};
exports.deleteUser = deleteUser;
const updateUser = async function (req, res) {
    try {
        /* Get the user passed by userByID middleware */
        const user = res.locals.profile;
        /* Loop over the user's credentials and build the query incrementally */
        /* We do this as this input is not constant everytime */
        /* Example: */
        /* Input 1: UPDATE users SET email = $1 WHERE user_id = $2 */
        /* Input 2: UPDATE users SET password = $1 WHERE user_id = $2 */
        /* Input 3: UPDATE users SET email = $1, password = $2 WHERE user_id = $3 */
        /* Can be extended for more credentials */
        let query = `UPDATE users SET `;
        let params = [];
        Object.entries(req.body).forEach(async (entry, index) => {
            switch (entry[0]) {
                case 'email': {
                    query +=
                        index === 0 ? `email = $${index + 1}` : `, email = $${index + 1}`;
                    params.push(entry[1]);
                    break;
                }
                case 'password': {
                    query +=
                        index === 0 ? `hash = $${index + 1}` : `, hash = $${index + 1}`;
                    params.push(entry[1]);
                    break;
                }
                default:
                    res.status(400).json({ message: 'Bad parameter.' });
            }
        });
        query += ` WHERE user_id = $${params.length + 1}`;
        params.push(user.user_id);
        /* Validate database operation success */
        const operationResult = await (0, db_1.execute)(query, params);
        if ('error' in operationResult[0])
            throw new Error(operationResult[0].error);
        /* Request ended successfully */
        res.status(200).json(operationResult[0]);
    }
    catch (err) {
        console.log(err);
        if (err instanceof Error)
            res.status(400).json({
                Error: err.message
            });
        else {
            console.log(err);
            res.status(400).json({
                Error: err
            });
        }
    }
};
exports.updateUser = updateUser;
