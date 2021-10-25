import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../app';

let connection: Connection;

describe('Show Profile from User', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should be able to show profile to user', async () => {
    const session = await request(app).post('/api/v1/sessions')
      .send({
        email: 'admin1235@gmail.com',
        password: '1234'
      });
    const { token } = session.body;
    const res = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${token}`
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });
});
