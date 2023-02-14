import { NextFunction, Request, Response } from 'express';

import { execute } from '../../db';
import { User, UserSchema, UserSchemaError } from '../../models/User';

const createUser = async function (req: Request, res: Response) {
  try {
    /* Validate input & Create User */
    const user = User(req.body);
    if (!('email' in user) && !('hash' in user)) throw new Error(user);

    const query = 'INSERT INTO "users" (email, hash) VALUES ($1, $2);';
    const operationResult = await execute<UserSchema>(query, [
      user.email,
      user.hash
    ]);

    /* Validate database operation success */
    if ('error' in operationResult[0])
      throw new Error(operationResult[0].error as string);

    /* Request ended successfully */
    res.status(200).json(operationResult[0]);
  } catch (err) {
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

const userByID = async function (
  req: Request,
  res: Response,
  next: NextFunction,
  userID: string
) {
  try {
    /* Validate input & Get User */
    if (!userID) throw new Error(UserSchemaError.userIDMissing);
    const query = 'SELECT user_id, email FROM "users" WHERE user_id = $1;';
    const user = await execute<UserSchema>(query, [userID]);

    /* Validate database operation success */
    if (!('user_id' in user[0]) && !('email' in user[0]))
      throw new Error(user[0]);

    /* Pass the user to the next function */
    res.locals.profile = user[0];
    next();
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({
        Error: err.message
      });
    } else {
      console.log(err);
      return res.status(400).json({
        Error: err
      });
    }
  }
};

const getUsers = async function (req: Request, res: Response) {
  try {
    const query = 'SELECT * FROM "users";';
    const operationResult = await execute<UserSchema>(query, []);

    /* Validate database operation success */
    if ('error' in operationResult[0])
      throw new Error(operationResult[0].error as string);

    /* Request ended successfully */
    res.status(200).json({ users: operationResult });
  } catch (err) {
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

const getUser = async function (req: Request, res: Response) {
  res.status(200).json({ user: res.locals.profile });
};

const deleteUser = async function (req: Request, res: Response) {
  try {
    /* Get the user passed by userByID middleware */
    const user = res.locals.profile;

    const query = 'DELETE FROM "users" WHERE user_id = $1;';
    const operationResult = await execute<UserSchema>(query, [user.user_id]);

    /* Validate database operation success */
    if ('error' in operationResult[0])
      throw new Error(operationResult[0].error as string);

    /* Request ended successfully */
    res.status(200).json(operationResult[0]);
  } catch (err) {
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

const updateUser = async function (req: Request, res: Response) {
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
    let params: string[] = [];

    Object.entries(req.body).forEach(async (entry, index) => {
      switch (entry[0]) {
        case 'email': {
          query +=
            index === 0 ? `email = $${index + 1}` : `, email = $${index + 1}`;
          params.push(entry[1] as string);
          break;
        }
        case 'password': {
          query +=
            index === 0 ? `hash = $${index + 1}` : `, hash = $${index + 1}`;
          params.push(entry[1] as string);
          break;
        }
        default:
          res.status(400).json({ message: 'Bad parameter.' });
      }
    });

    query += ` WHERE user_id = $${params.length + 1}`;
    params.push(user.user_id);

    /* Validate database operation success */
    const operationResult = await execute<UserSchema>(query, params);
    if ('error' in operationResult[0])
      throw new Error(operationResult[0].error as string);

    /* Request ended successfully */
    res.status(200).json(operationResult[0]);
  } catch (err) {
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

export { createUser, deleteUser, getUser, getUsers, updateUser, userByID };
