import { User } from '../../models/users';
import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

const testUser: User[] = [
  {
    firstname: 'TestUser1',
    lastname: 'Surname1',
    email: 'testuser1@test.com',
    password: 't3st1'
  },
  {
    firstname: 'TestUser2',
    lastname: 'Surname2',
    email: 'testuser2@test.com',
    password: 't3st2'
  }
];

const conflictingUser: User = {
  firstname: 'TestUser11',
  lastname: 'Surname11',
  email: 'testuser1@test.com',
  password: 't3st11'
};

let token: string;

describe('/users ROUTE :: ', () => {
  it('Expects GET / (index) endpoint call without valid token should fail with error 400', async () => {
    const result = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toEqual(401);
  });

  it('Expects POST / (index) endpoint call to return status 200 and token', async () => {
    const response = await request.post('/users').send(testUser[0]);

    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
    token = response.body.token;
  });

  it('Expects GET / (index) endpoint call with valid token should return status 200 and user info', async () => {
    const result = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toEqual(200);
    expect(Object.keys(result.body).length).toEqual(1);
  });

  it('Expects POST / (index) endpoint call with duplicate email to return error status 400', async () => {
    const response = await request.post('/users').send(conflictingUser);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({});
  });

  it('Expects POST / (index) endpoint call to return status 200 and token', async () => {
    const response = await request.post('/users').send(testUser[1]);

    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
  });

  it('Expects POST /login endpoint call with invalid login details to return status 401', async () => {
    const response = await request.post('/users/login').send({
      email: testUser[0].email,
      password: 'password'
    });

    expect(response.status).toEqual(401);
  });

  it('Expects POST /login endpoint call to return status 200 and token', async () => {
    const response = await request.post('/users/login').send({
      email: testUser[0].email,
      password: testUser[0].password
    });

    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
    token = response.body.token;
  });

  it('Expects GET /users/:id endpoint call with valid token should return status 200 and user info', async () => {
    const result = await request
      .get('/users/1')
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toEqual(200);
  });
});
