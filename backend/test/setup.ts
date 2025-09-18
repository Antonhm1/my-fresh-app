import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { db } from '../src/utils/database.js';

// Test database setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';

  console.log('Setting up test database...');

  // Wait for database connection to be established
  const isHealthy = await db.healthCheck();
  if (!isHealthy) {
    throw new Error('Database connection failed during test setup');
  }

  console.log('Test database connection established');
});

afterAll(async () => {
  console.log('Cleaning up test database...');

  // Close database connections
  await db.close();

  console.log('Test cleanup completed');
});

// Clean up data between tests
beforeEach(async () => {
  // Clear test data (but keep schema and seed data)
  // We'll be careful to only delete test-specific data
});

afterEach(async () => {
  // Additional cleanup if needed
});

// Helper functions for tests
export const createTestEvent = async (overrides = {}) => {
  const defaultEvent = {
    tenant_id: 1,
    title: 'Test Event',
    description: 'Test event description',
    start_date: new Date('2025-12-25 10:00:00'),
    end_date: new Date('2025-12-25 11:00:00'),
    location: 'Test Location',
    is_featured_banner: false,
    ...overrides
  };

  const result = await db.query(
    `INSERT INTO events (tenant_id, title, description, start_date, end_date, location, is_featured_banner)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      defaultEvent.tenant_id,
      defaultEvent.title,
      defaultEvent.description,
      defaultEvent.start_date,
      defaultEvent.end_date,
      defaultEvent.location,
      defaultEvent.is_featured_banner
    ]
  );

  return result.rows[0];
};

export const createTestInfo = async (overrides = {}) => {
  const defaultInfo = {
    tenant_id: 1,
    title: 'Test Info',
    content: 'Test info content',
    type: 'general',
    is_featured_banner: false,
    published_at: new Date(),
    ...overrides
  };

  const result = await db.query(
    `INSERT INTO info (tenant_id, title, content, type, is_featured_banner, published_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      defaultInfo.tenant_id,
      defaultInfo.title,
      defaultInfo.content,
      defaultInfo.type,
      defaultInfo.is_featured_banner,
      defaultInfo.published_at
    ]
  );

  return result.rows[0];
};

export const cleanupTestData = async () => {
  // Delete test data created during tests
  await db.query(`DELETE FROM events WHERE title LIKE 'Test%'`);
  await db.query(`DELETE FROM info WHERE title LIKE 'Test%'`);
};