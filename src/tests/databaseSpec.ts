import { execute } from '../db';
import { MovieSchema } from '../models/Movie';
import { UserSchema } from '../models/User';
import { WatchListSchema } from '../models/WatchList';

// **********************************************
// Global Variables

let user1_id: string;
let user2_id: string;
let movie1_id: string;
let movie2_id: string;

const USER_DATA = {
  email1: 'database_test1@test.com',
  password1: 'database_test_password1',
  email2: 'database_test2@test.com',
  password2: 'database_test_password2',
  updatedEmail: 'database_test_updated@test.com',
  updatedPassword: 'database_test_password_updated'
};

const MOVIE_DATA = {
  name1: 'Titanic',
  releaseDate1: '1997-12-19',
  name2: 'Heat',
  releaseDate2: '1995-12-15',
  updatedName: 'Stalker',
  updatedReleaseDate: '1979-05-25'
};

// **********************************************
// User Test Cases
// **********************************************

describe('Test database queries', () => {
  // *************** User ***************
  it('Should create user', async () => {
    // Start with a clean slate
    await execute('TRUNCATE TABLE users CASCADE;', []);

    const query =
      'INSERT INTO "users" (email, hash) VALUES ($1, $2), ($3, $4);';
    const params = [
      USER_DATA.email1,
      USER_DATA.password1,
      USER_DATA.email2,
      USER_DATA.password2
    ];

    const operationResult = await execute<UserSchema>(query, params);
    expect(operationResult[0].message).toBe(
      'INSERT was successful.' as unknown as string
    );
  });

  // **********************************************
  it("Shouldn't create user with the same email", async () => {
    const query = 'INSERT INTO "users" (email, hash) VALUES ($1, $2);';
    const params = [USER_DATA.email1, USER_DATA.password1];
    const operationResult = await execute<UserSchema>(query, params);
    expect(operationResult[0]).toBe(
      `Error: duplicate key value violates unique constraint "users_email_key"` as unknown as UserSchema
    );
  });

  // **********************************************
  it('Should select all users', async () => {
    const query = 'SELECT * FROM "users";';
    const operationResult = await execute<UserSchema>(query, []);
    user1_id = operationResult[0].user_id;
    user2_id = operationResult[1].user_id;
    expect(operationResult[0].email).toBe(USER_DATA.email1);
    expect(operationResult[0].hash).toBe(USER_DATA.password1);
    expect(operationResult[1].email).toBe(USER_DATA.email2);
    expect(operationResult[1].hash).toBe(USER_DATA.password2);
  });

  // **********************************************
  // Movies Test Cases
  // **********************************************
  it('Should create a movie', async () => {
    // Start with a clean slate
    await execute('TRUNCATE TABLE movies CASCADE;');

    const query =
      'INSERT INTO "movies" (name, release_date) VALUES ($1, $2), ($3, $4);';
    const params = [
      MOVIE_DATA.name1,
      MOVIE_DATA.releaseDate1,
      MOVIE_DATA.name2,
      MOVIE_DATA.releaseDate2
    ];
    const operationMessage = await execute<MovieSchema>(query, params);
    expect(operationMessage[0].message).toBe(
      'INSERT was successful.' as unknown as string
    );
  });

  // **********************************************
  it("Shouldn't create a movie with the same name", async () => {
    const query = 'INSERT INTO "movies" (name, release_date) VALUES ($1, $2);';
    const params = ['Titanic', '1997-12-19'];
    const operationMessage = await execute<MovieSchema>(query, params);
    expect(operationMessage[0]).toBe(
      `Error: duplicate key value violates unique constraint "movies_name_key"` as unknown as MovieSchema
    );
  });

  // **********************************************
  it('Should select all movies', async () => {
    const query =
      'SELECT *,to_char(movies.release_date, \'yyyy-mm-dd\') AS formatted_release_date FROM "movies";';
    const operationResult = await execute<MovieSchema>(query);
    movie1_id = operationResult[0].movie_id;
    movie2_id = operationResult[1].movie_id;
    expect(operationResult[0].name).toBe(MOVIE_DATA.name1);
    expect(operationResult[0].formatted_release_date).toBe(
      MOVIE_DATA.releaseDate1
    );
    expect(operationResult[1].name).toBe(MOVIE_DATA.name2);
    expect(operationResult[1].formatted_release_date).toBe(
      MOVIE_DATA.releaseDate2
    );
  });

  // **********************************************
  // Watch List Test Cases
  // **********************************************
  it('Should create a watch_list', async () => {
    // Start with a clean slate
    await execute('TRUNCATE TABLE watch_list;');

    const query =
      'INSERT INTO "watch_list" (user_id, movie_id) VALUES ($1, $2), ($3, $4);';
    const params = [user1_id, movie1_id, user1_id, movie2_id];
    const operationMessage = await execute<WatchListSchema>(query, params);
    expect(operationMessage[0].message).toBe(
      'INSERT was successful.' as unknown as string
    );
  });

  // **********************************************
  it('Should select all movies watch by user', async () => {
    const query =
      "SELECT email, name, to_char(m.release_date, 'yyyy-mm-dd')" +
      ' ' +
      'AS formatted_release_date' +
      ' ' +
      'FROM users AS u INNER JOIN watch_list as w' +
      ' ' +
      'ON u.user_id = w.user_id' +
      ' ' +
      'INNER JOIN movies AS m' +
      ' ' +
      'ON w.movie_id = m.movie_id' +
      ' ' +
      'WHERE u.user_id = $1' +
      ';';
    const operationResult = await execute<WatchListSchema>(query, [user1_id]);

    expect(operationResult[0].email).toBe(USER_DATA.email1);
    expect(operationResult[0].name).toBe(MOVIE_DATA.name1);
    expect(operationResult[1].email).toBe(USER_DATA.email1);
    expect(operationResult[1].name).toBe(MOVIE_DATA.name2);
  });
  // **********************************************
});
