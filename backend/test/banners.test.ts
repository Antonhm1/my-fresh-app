import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';
import { createTestEvent, createTestInfo, cleanupTestData } from './setup.js';

describe('Banners API', () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('GET /api/banners', () => {
    it('should return combined featured events and info as banners', async () => {
      // Create featured events and info
      await createTestEvent({
        title: 'Test Featured Event',
        description: 'Event description',
        start_date: new Date('2025-12-25T10:00:00Z'),
        location: 'Test Location',
        is_featured_banner: true
      });

      await createTestInfo({
        title: 'Test Featured Info',
        content: 'Info content',
        type: 'news',
        published_at: new Date('2025-12-24T10:00:00Z'),
        is_featured_banner: true
      });

      // Create non-featured items (should not appear in banners)
      await createTestEvent({
        title: 'Test Regular Event',
        is_featured_banner: false
      });

      await createTestInfo({
        title: 'Test Regular Info',
        is_featured_banner: false
      });

      const response = await request(app)
        .get('/api/banners')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.banners).toHaveLength(2);
      expect(response.body.data.meta.events_count).toBe(1);
      expect(response.body.data.meta.info_count).toBe(1);

      // Check banner structure
      const banners = response.body.data.banners;
      const eventBanner = banners.find((b: any) => b.type === 'event');
      const infoBanner = banners.find((b: any) => b.type === 'info');

      expect(eventBanner).toBeDefined();
      expect(eventBanner.title).toBe('Test Featured Event');
      expect(eventBanner.description).toBe('Event description');
      expect(eventBanner.location).toBe('Test Location');

      expect(infoBanner).toBeDefined();
      expect(infoBanner.title).toBe('Test Featured Info');
      expect(infoBanner.content).toBe('Info content');
    });

    it('should sort banners by date (newest first)', async () => {
      // Create banners with different dates
      await createTestEvent({
        title: 'Older Event',
        start_date: new Date('2025-12-20T10:00:00Z'),
        is_featured_banner: true
      });

      await createTestEvent({
        title: 'Newer Event',
        start_date: new Date('2025-12-25T10:00:00Z'),
        is_featured_banner: true
      });

      await createTestInfo({
        title: 'Middle Info',
        published_at: new Date('2025-12-22T10:00:00Z'),
        is_featured_banner: true
      });

      const response = await request(app)
        .get('/api/banners')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.banners).toHaveLength(3);

      const banners = response.body.data.banners;
      expect(banners[0].title).toBe('Newer Event'); // Newest first
      expect(banners[1].title).toBe('Middle Info');
      expect(banners[2].title).toBe('Older Event'); // Oldest last
    });

    it('should respect limit parameter', async () => {
      // Create multiple featured banners
      for (let i = 1; i <= 5; i++) {
        await createTestEvent({
          title: `Test Event ${i}`,
          start_date: new Date(`2025-12-${20 + i}T10:00:00Z`),
          is_featured_banner: true
        });
      }

      const response = await request(app)
        .get('/api/banners?limit=3')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.banners).toHaveLength(3);
      expect(response.body.data.meta.limit).toBe(3);
    });

    it('should validate limit parameter', async () => {
      const response = await request(app)
        .get('/api/banners?limit=51')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Limit must be between 1 and 50');
    });

    it('should return empty array when no featured items exist', async () => {
      // Create non-featured items
      await createTestEvent({ title: 'Regular Event', is_featured_banner: false });
      await createTestInfo({ title: 'Regular Info', is_featured_banner: false });

      const response = await request(app)
        .get('/api/banners')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.banners).toHaveLength(0);
      expect(response.body.data.meta.events_count).toBe(0);
      expect(response.body.data.meta.info_count).toBe(0);
    });
  });

  describe('GET /api/banners/:type/:id', () => {
    it('should return specific event banner', async () => {
      const testEvent = await createTestEvent({
        title: 'Test Featured Event',
        description: 'Event description',
        location: 'Test Location',
        is_featured_banner: true
      });

      const response = await request(app)
        .get(`/api/banners/event/${testEvent.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.banner.type).toBe('event');
      expect(response.body.data.banner.title).toBe('Test Featured Event');
      expect(response.body.data.banner.description).toBe('Event description');
      expect(response.body.data.banner.location).toBe('Test Location');
    });

    it('should return specific info banner', async () => {
      const testInfo = await createTestInfo({
        title: 'Test Featured Info',
        content: 'Info content',
        is_featured_banner: true
      });

      const response = await request(app)
        .get(`/api/banners/info/${testInfo.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.banner.type).toBe('info');
      expect(response.body.data.banner.title).toBe('Test Featured Info');
      expect(response.body.data.banner.content).toBe('Info content');
    });

    it('should return 404 for non-featured item', async () => {
      const testEvent = await createTestEvent({
        title: 'Test Regular Event',
        is_featured_banner: false
      });

      const response = await request(app)
        .get(`/api/banners/event/${testEvent.id}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Banner not found or not featured');
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .get('/api/banners/event/999999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Banner not found or not featured');
    });

    it('should validate type parameter', async () => {
      const response = await request(app)
        .get('/api/banners/invalid/1')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Type must be either "event" or "info"');
    });

    it('should validate ID parameter', async () => {
      const response = await request(app)
        .get('/api/banners/event/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid banner ID');
    });
  });
});