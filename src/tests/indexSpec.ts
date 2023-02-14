import supertest from 'supertest';

import { app } from '../server';

const request = supertest(app);

let U_ID = '';
let MOV_ID = '';

const USER_DATA = {
  email: 'index_test@test.com',
  password: 'index_test_password',
  updatedEmail: 'index_test_updated@test.com',
  updatedPassword: 'index_test_password_updated'
};

const MOVIE_DATA = {
  name: 'Harry Potter',
  releaseDate: '2002-01-16',
  updatedName: 'The Wind Rises',
  updatedReleaseDate: '2013-07-20'
};

describe('Test endpoint responses', () => {
  // **********************************************
  // User Test Cases
  // **********************************************
  it('Should create user', async () => {
    const res = await request
      .post('/api/users')
      .send({
        email: USER_DATA.email,
        password: USER_DATA.password
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.message).toBe('INSERT was successful.');
  });

  it('Should get all users', async () => {
    const res = await request
      .get('/api/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    U_ID = res.body.users[2].user_id;
    expect(res.body.users[2].email).toBe(USER_DATA.email);
    expect(res.body.users[2].hash).toBe(USER_DATA.password);
  });

  it('Should get a user by specific id', async () => {
    const res = await request
      .get(`/api/users/${U_ID}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.user.email).toBe(USER_DATA.email);
  });

  it('Should update a user by specific id', async () => {
    const res = await request
      .put(`/api/users/${U_ID}`)
      .send({
        email: USER_DATA.updatedEmail,
        password: USER_DATA.updatedPassword
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.message).toBe('UPDATE was successful.');
  });

  // it('Should delete a user by specific id', async () => {
  //   const res = await request
  //     .delete(`/api/users/${U_ID}`)
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200);
  //   expect(res.body.message).toBe('DELETE was successful.');
  // });

  // **********************************************
  // Movies Test Cases
  // **********************************************

  it('Should create movie', async () => {
    const res = await request
      .post(`/api/movies`)
      .send({
        name: 'Harry Potter',
        release_date: '2002-01-16'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.message).toBe('INSERT was successful.');
  });

  it('Should get all movies', async () => {
    const res = await request
      .get(`/api/movies`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    MOV_ID = res.body.movies[2].movie_id;
  });

  it('Should get movie by id', async () => {
    const res = await request
      .get(`/api/movies/${MOV_ID}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.movie.name).toBe(MOVIE_DATA.name);
    expect(res.body.movie.formatted_release_date).toBe(MOVIE_DATA.releaseDate);
  });

  it('Should update movie by id', async () => {
    const res = await request
      .put(`/api/movies/${MOV_ID}`)
      .send({
        name: MOVIE_DATA.updatedName,
        release_date: MOVIE_DATA.updatedReleaseDate
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.message).toBe('UPDATE was successful.');
  });

  // it('Should delete movie by id', async () => {
  //   const res = await request
  //     .delete(`/api/movies/${MOV_ID}`)
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200);

  //   expect(res.body.message).toBe('DELETE was successful.');
  // });

  // **********************************************
  // Movies Test Cases
  // **********************************************

  it('Should create watch list', async () => {
    const res = await request
      .post(`/api/users/${U_ID}/movies`)
      .send({
        movies: [{ movie_id: MOV_ID }]
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.message).toBe('INSERT was successful.');
  });

  it('Should get watch list', async () => {
    const res = await request
      .get(`/api/users/${U_ID}/movies`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.watchList[0].email).toBe(USER_DATA.updatedEmail);
    expect(res.body.watchList[0].name).toBe(MOVIE_DATA.updatedName);
  });

  it('Should a movie in watch list', async () => {
    const res = await request
      .get(`/api/users/${U_ID}/movies/${MOV_ID}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.watchList.name).toBe(MOVIE_DATA.updatedName);
    expect(res.body.watchList.formatted_release_date).toBe(
      MOVIE_DATA.updatedReleaseDate
    );
  });
});
