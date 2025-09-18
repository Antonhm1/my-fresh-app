import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';
import { createTestEvent, cleanupAllData } from './setup.js';

describe('Events API', () => {
  beforeEach(async () => {
    await cleanupAllData();
  });

  afterEach(async () => {
    await cleanupAllData();
  });

  describe('GET /api/events', () => {
    it('should return all events for the tenant', async () => {
      // Create test events
      await createTestEvent({ title: 'Test Event 1' });
      await createTestEvent({ title: 'Test Event 2', is_featured_banner: true });

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.events).toHaveLength(2);
      expect(response.body.data.pagination.total).toBe(2);
    });

    it('should filter events by featured status', async () => {
      await createTestEvent({ title: 'Test Regular Event', is_featured_banner: false });
      await createTestEvent({ title: 'Test Featured Event', is_featured_banner: true });

      const response = await request(app)
        .get('/api/events?featured=true')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.events).toHaveLength(1);
      expect(response.body.data.events[0].title).toBe('Test Featured Event');
      expect(response.body.data.events[0].is_featured_banner).toBe(true);
    });

    it('should respect pagination parameters', async () => {
      // Create multiple test events
      for (let i = 1; i <= 5; i++) {
        await createTestEvent({ title: `Test Event ${i}` });
      }

      const response = await request(app)
        .get('/api/events?limit=2&offset=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.events).toHaveLength(2);
      expect(response.body.data.pagination.limit).toBe(2);
      expect(response.body.data.pagination.offset).toBe(1);
      expect(response.body.data.pagination.hasMore).toBe(true);
    });

    it('should validate pagination parameters', async () => {
      const response = await request(app)
        .get('/api/events?limit=101')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Limit must be between 1 and 100');
    });
  });

  describe('GET /api/events/:id', () => {
    it('should return a specific event', async () => {
      const testEvent = await createTestEvent({ title: 'Test Specific Event' });

      const response = await request(app)
        .get(`/api/events/${testEvent.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.event.id).toBe(testEvent.id);
      expect(response.body.data.event.title).toBe('Test Specific Event');
    });

    it('should return 404 for non-existent event', async () => {
      const response = await request(app)
        .get('/api/events/999999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Event not found');
    });

    it('should return 400 for invalid event ID', async () => {
      const response = await request(app)
        .get('/api/events/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid event ID');
    });
  });

  describe('POST /api/events', () => {
    it('should create a new event', async () => {
      const eventData = {
        title: 'Test New Event',
        description: 'Test event description',
        start_date: '2025-12-25T10:00:00Z',
        end_date: '2025-12-25T11:00:00Z',
        location: 'Test Location',
        is_featured_banner: true
      };

      const response = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.event.title).toBe(eventData.title);
      expect(response.body.data.event.is_featured_banner).toBe(true);
      expect(response.body.message).toBe('Event created successfully');
    });

    it('should validate required fields', async () => {
      const invalidEventData = {
        description: 'Missing title and start_date'
      };

      const response = await request(app)
        .post('/api/events')
        .send(invalidEventData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Missing required field: title');
    });

    it('should validate date formats', async () => {
      const invalidEventData = {
        title: 'Test Event',
        start_date: 'invalid-date'
      };

      const response = await request(app)
        .post('/api/events')
        .send(invalidEventData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid start_date format');
    });

    it('should validate end_date is after start_date', async () => {
      const invalidEventData = {
        title: 'Test Event',
        start_date: '2025-12-25T11:00:00Z',
        end_date: '2025-12-25T10:00:00Z'
      };

      const response = await request(app)
        .post('/api/events')
        .send(invalidEventData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('End date cannot be before start date');
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should update an existing event', async () => {
      const testEvent = await createTestEvent({ title: 'Original Title' });

      const updateData = {
        title: 'Updated Title',
        is_featured_banner: true
      };

      const response = await request(app)
        .put(`/api/events/${testEvent.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.event.title).toBe('Updated Title');
      expect(response.body.data.event.is_featured_banner).toBe(true);
      expect(response.body.message).toBe('Event updated successfully');
    });

    it('should return 404 for non-existent event', async () => {
      const response = await request(app)
        .put('/api/events/999999')
        .send({ title: 'Updated Title' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Event not found');
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete an existing event', async () => {
      const testEvent = await createTestEvent({ title: 'Event to Delete' });

      const response = await request(app)
        .delete(`/api/events/${testEvent.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Event deleted successfully');

      // Verify event is deleted
      const getResponse = await request(app)
        .get(`/api/events/${testEvent.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent event', async () => {
      const response = await request(app)
        .delete('/api/events/999999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Event not found');
    });
  });
});