const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server } = require('../server'); // Express app

let mongoServer;

beforeAll(async () => {
  // Create a MongoMemoryServer instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // If already connected from server.js execution, disconnect first
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // Connect to the in-memory database
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  
  if (server) {
    server.close(); // Close http server to prevent open handles
  }
});

describe('Auth API', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should not register user with an existing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User 2',
        email: 'test@example.com', // same email
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('should login an existing user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should fail to login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  it('should get current user profile using token', async () => {
    // First login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    
    const token = loginRes.body.data.token;

    // Get profile
    const profileRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(profileRes.statusCode).toEqual(200);
    expect(profileRes.body.success).toBe(true);
    expect(profileRes.body.data.email).toBe('test@example.com');
  });
});
