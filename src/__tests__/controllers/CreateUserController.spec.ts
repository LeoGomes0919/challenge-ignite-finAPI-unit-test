import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../app';

let connection: Connection;

describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should to be able to create a new user', async () => {
    const res = await request(app).post('/api/v1/users')
      .send({
        name: 'Admin',
        email: 'admin1235@gmail.com',
        password: '1234'
      });
    expect(res.status).toBe(201);
  });

  it('should not be able to create a new user with same email existing', async () => {
    const res = await request(app).post('/api/v1/users')
      .send({
        name: 'Admin',
        email: 'admin123@gmail.com',
        password: '1234'
      });
    expect(res.status).toBe(400);
  });
});
