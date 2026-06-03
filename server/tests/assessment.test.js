const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server } = require('../server');
const Assessment = require('../models/Assessment');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(mongoUri);

  await Assessment.create({
    title: 'Test Assessment',
    slug: 'test-assessment',
    description: 'Test Desc',
    questions: [
      { text: 'Q1', options: [{ label: 'A', score: 1 }] }
    ],
    scoreThresholds: [
      { minScore: 0, maxScore: 5, severity: 'Low', recommendation: 'None' }
    ]
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  if (server) server.close();
});

describe('Assessment API', () => {
  it('should fetch an assessment by slug', async () => {
    const res = await request(app).get('/api/assessments/test-assessment');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('test-assessment');
  });

  it('should return 404 for invalid assessment slug', async () => {
    const res = await request(app).get('/api/assessments/invalid-slug');
    expect(res.statusCode).toEqual(404);
  });

  it('should reject unauthenticated submission', async () => {
    const res = await request(app)
      .post('/api/assessments/test-assessment/submit')
      .send({ answers: [1] });
    expect(res.statusCode).toEqual(401);
  });
});
