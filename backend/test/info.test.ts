import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';
import { createTestInfo, cleanupTestData } from './setup.js';

describe('Info API', () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('GET /api/info', () => {
    it('should return all info for the tenant', async () => {
      await createTestInfo({ title: 'Test Info 1', type: 'news' });
      await createTestInfo({ title: 'Test Info 2', type: 'announcement', is_featured_banner: true });

      const response = await request(app)
        .get('/api/info')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.info).toHaveLength(2);
      expect(response.body.data.pagination.total).toBe(2);
    });

    it('should filter info by featured status', async () => {
      await createTestInfo({ title: 'Test Regular Info', is_featured_banner: false });
      await createTestInfo({ title: 'Test Featured Info', is_featured_banner: true });

      const response = await request(app)
        .get('/api/info?featured=true')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.info).toHaveLength(1);
      expect(response.body.data.info[0].title).toBe('Test Featured Info');
      expect(response.body.data.info[0].is_featured_banner).toBe(true);
    });

    it('should filter info by type', async () => {
      await createTestInfo({ title: 'Test News', type: 'news' });
      await createTestInfo({ title: 'Test Announcement', type: 'announcement' });
      await createTestInfo({ title: 'Test General', type: 'general' });

      const response = await request(app)
        .get('/api/info?type=news')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.info).toHaveLength(1);
      expect(response.body.data.info[0].title).toBe('Test News');
      expect(response.body.data.info[0].type).toBe('news');
    });

    it('should validate type parameter', async () => {
      const response = await request(app)
        .get('/api/info?type=invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Type must be one of: news, announcement, general');
    });

    it('should respect pagination parameters', async () => {
      for (let i = 1; i <= 5; i++) {
        await createTestInfo({ title: `Test Info ${i}` });
      }

      const response = await request(app)
        .get('/api/info?limit=2&offset=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.info).toHaveLength(2);
      expect(response.body.data.pagination.limit).toBe(2);
      expect(response.body.data.pagination.offset).toBe(1);
      expect(response.body.data.pagination.hasMore).toBe(true);
    });
  });

  describe('GET /api/info/:id', () => {
    it('should return a specific info item', async () => {
      const testInfo = await createTestInfo({ title: 'Test Specific Info' });

      const response = await request(app)
        .get(`/api/info/${testInfo.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.info.id).toBe(testInfo.id);
      expect(response.body.data.info.title).toBe('Test Specific Info');
    });

    it('should return 404 for non-existent info', async () => {
      const response = await request(app)
        .get('/api/info/999999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Info not found');
    });

    it('should return 400 for invalid info ID', async () => {
      const response = await request(app)
        .get('/api/info/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid info ID');
    });
  });

  describe('POST /api/info', () => {
    it('should create new info', async () => {
      const infoData = {
        title: 'Test New Info',
        content: 'Test info content',
        type: 'news',
        is_featured_banner: true
      };

      const response = await request(app)
        .post('/api/info')
        .send(infoData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.info.title).toBe(infoData.title);
      expect(response.body.data.info.content).toBe(infoData.content);
      expect(response.body.data.info.type).toBe(infoData.type);
      expect(response.body.data.info.is_featured_banner).toBe(true);
      expect(response.body.message).toBe('Info created successfully');
    });

    it('should validate required fields', async () => {
      const invalidInfoData = {
        type: 'news'
      };

      const response = await request(app)
        .post('/api/info')
        .send(invalidInfoData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Missing required field: title');
    });

    it('should validate type field', async () => {
      const invalidInfoData = {
        title: 'Test Info',
        content: 'Test content',
        type: 'invalid'
      };

      const response = await request(app)
        .post('/api/info')
        .send(invalidInfoData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Type must be one of: news, announcement, general');
    });

    it('should default type to general if not provided', async () => {
      const infoData = {
        title: 'Test Info',
        content: 'Test content'
      };

      const response = await request(app)
        .post('/api/info')
        .send(infoData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.info.type).toBe('general');
    });

    it('should validate published_at date format', async () => {
      const invalidInfoData = {
        title: 'Test Info',
        content: 'Test content',
        published_at: 'invalid-date'
      };

      const response = await request(app)
        .post('/api/info')
        .send(invalidInfoData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid published_at format');
    });
  });

  describe('PUT /api/info/:id', () => {
    it('should update existing info', async () => {
      const testInfo = await createTestInfo({ title: 'Original Title', type: 'general' });

      const updateData = {
        title: 'Updated Title',
        type: 'news',
        is_featured_banner: true
      };

      const response = await request(app)
        .put(`/api/info/${testInfo.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.info.title).toBe('Updated Title');
      expect(response.body.data.info.type).toBe('news');
      expect(response.body.data.info.is_featured_banner).toBe(true);
      expect(response.body.message).toBe('Info updated successfully');
    });

    it('should return 404 for non-existent info', async () => {
      const response = await request(app)
        .put('/api/info/999999')
        .send({ title: 'Updated Title' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Info not found');
    });
  });

  describe('DELETE /api/info/:id', () => {
    it('should delete existing info', async () => {
      const testInfo = await createTestInfo({ title: 'Info to Delete' });

      const response = await request(app)
        .delete(`/api/info/${testInfo.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Info deleted successfully');

      // Verify info is deleted
      const getResponse = await request(app)
        .get(`/api/info/${testInfo.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent info', async () => {
      const response = await request(app)
        .delete('/api/info/999999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Info not found');
    });
  });
});