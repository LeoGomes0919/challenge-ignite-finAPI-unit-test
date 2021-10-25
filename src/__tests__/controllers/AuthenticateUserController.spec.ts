import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../app';

let connection: Connection;

describe('Create Session for User', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should be able to create session for user', async () => {
    const session = await request(app).post('/api/v1/sessions')
      .send({
        email: 'admin1235@gmail.com',
        password: '1234'
      });

    expect(session.body).toHaveProperty('token');
  });

  it('should not be able to create session noneexisting user', async () => {
    const session = await request(app).post('/api/v1/sessions')
      .send({
        email: 'admin321@gmail.com',
        password: '1234'
      });

    expect(session.status).toBe(401);
  });

  it('Should not be able to create a session if password is incorrect', async () => {
    const session = await request(app).post('/api/v1/sessions')
      .send({
        email: 'admin1235@gmail.com',
        password: '12345567'
      });

    expect(session.status).toBe(401);
  });
});
