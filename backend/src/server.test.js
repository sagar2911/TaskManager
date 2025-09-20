const request = require('supertest');
const app = require('./src/server');

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/boards', () => {
    it('should return boards array', async () => {
      const response = await request(app)
        .get('/api/boards')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/boards', () => {
    it('should create a new board with valid data', async () => {
      const boardData = {
        title: 'Test Board',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/boards')
        .send(boardData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('title', boardData.title);
      expect(response.body.data).toHaveProperty('description', boardData.description);
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        title: '', // Empty title should fail validation
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/boards')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Validation failed');
    });
  });
});

