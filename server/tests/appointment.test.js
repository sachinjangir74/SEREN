const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server } = require('../server');

let mongoServer;
let userToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(mongoUri);

  // Register a user to get token
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Appt User',
      email: 'appt@example.com',
      password: 'password123',
    });
  
  userToken = res.body.data.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  if (server) server.close();
});

describe('Appointments API', () => {
  let appointmentId;

  it('should create an appointment', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Appt User',
        email: 'appt@example.com',
        phone: '1234567890',
        doctor: 'Dr. Smith',
        mode: 'video',
        date: '2026-05-01',
        time: '14:00',
        duration: 45,
        service: 'cbt'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    appointmentId = res.body.data._id;
  });

  it('should get all appointments for the user', async () => {
    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some(a => a._id === appointmentId)).toBe(true);
  });
});
