"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
// **********************************************
// Global Variables
let user1_id;
let user2_id;
let movie1_id;
let movie2_id;
// **********************************************
// Test Cases
describe('Test database queries', () => {
    it('Should create user', async () => {
        // Start with a clean slate
        await (0, db_1.truncateQuery)('TRUNCATE TABLE users CASCADE;');
        const query = 'INSERT INTO "users" (email, hash) VALUES ($1, $2), ($3, $4);';
        const params = [
            'tst1@test.com',
            'test_passwd',
            'tst2@test.com',
            'test_passwd'
        ];
        const operationMessage = await (0, db_1.insertQuery)(query, params);
        expect(operationMessage).toBe('Insert was successful');
    });
    // **********************************************
    it("Shouldn't create user with the same email", async () => {
        const query = 'INSERT INTO "users" (email, hash) VALUES ($1, $2);';
        const params = ['tst1@test.com', 'test_passwd'];
        const operationMessage = await (0, db_1.insertQuery)(query, params);
        expect(operationMessage).toBe(`Insert Failed - Unique Violation: duplicate key value violates unique constraint "users_email_key"`);
    });
    // **********************************************
    it('Should select all users', async () => {
        const query = 'SELECT * FROM "users";';
        const operationResult = await (0, db_1.selectAllQuery)(query);
        user1_id = operationResult[0].id;
        user2_id = operationResult[1].id;
        expect(operationResult[0].email).toBe('tst1@test.com');
        expect(operationResult[0].hash).toBe('test_passwd');
    });
    // **********************************************
    it('Should create a movie', async () => {
        // Start with a clean slate
        await (0, db_1.truncateQuery)('TRUNCATE TABLE movies CASCADE;');
        const query = 'INSERT INTO "movies" (name, release_date) VALUES ($1, $2), ($3, $4);';
        const params = ['Titanic', '1997-12-19', 'Stalker', '1979-05-25'];
        const operationMessage = await (0, db_1.insertQuery)(query, params);
        expect(operationMessage).toBe('Insert was successful');
    });
    // **********************************************
    it("Shouldn't create a movie with the same name", async () => {
        const query = 'INSERT INTO "movies" (name, release_date) VALUES ($1, $2);';
        const params = ['Titanic', '1997-12-19'];
        const operationMessage = await (0, db_1.insertQuery)(query, params);
        expect(operationMessage).toBe(`Insert Failed - Unique Violation: duplicate key value violates unique constraint "movies_name_key"`);
    });
    // **********************************************
    it('Should select all movies', async () => {
        const query = 'SELECT *,to_char(movies.release_date, \'yyyy-mm-dd\') AS formatted_release_date FROM "movies";';
        const operationResult = await (0, db_1.selectAllQuery)(query);
        movie1_id = operationResult[0].id;
        movie2_id = operationResult[1].id;
        expect(operationResult[0].name).toBe('Titanic');
        expect(operationResult[0].formatted_release_date).toBe('1997-12-19');
    });
    // **********************************************
    it('Should create a watch_list', async () => {
        // Start with a clean slate
        await (0, db_1.truncateQuery)('TRUNCATE TABLE watch_list;');
        const query = 'INSERT INTO "watch_list" (user_id, movie_id) VALUES ($1, $2), ($3, $4);';
        const params = [user1_id, movie1_id, user1_id, movie2_id];
        const operationMessage = await (0, db_1.insertQuery)(query, params);
        expect(operationMessage).toBe('Insert was successful');
    });
    it('Should select all movies watch by user', async () => {
        const query = 'SELECT email, name from users ' +
            'INNER JOIN watch_list ON users.id = watch_list.user_id ' +
            'INNER JOIN movies ON watch_list.movie_id = movies.id;';
        const operationResult = await (0, db_1.selectAllQuery)(query);
        expect(operationResult[0].email).toBe('tst1@test.com');
        expect(operationResult[0].name).toBe('Titanic');
        expect(operationResult[1].email).toBe('tst1@test.com');
        expect(operationResult[1].name).toBe('Stalker');
    });
});
