import { readdir, readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database connection configuration
const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'gislev_kirke_dev',
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Migration tracking table
const createMigrationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log('Migrations table ready');
};

// Get list of executed migrations
const getExecutedMigrations = async () => {
  const result = await pool.query('SELECT filename FROM migrations ORDER BY id');
  return result.rows.map(row => row.filename);
};

// Mark migration as executed
const markMigrationExecuted = async (filename) => {
  await pool.query('INSERT INTO migrations (filename) VALUES ($1)', [filename]);
};

// Execute a single migration
const executeMigration = async (filename, content) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Execute the migration SQL
    await client.query(content);

    // Mark as executed
    await client.query('INSERT INTO migrations (filename) VALUES ($1)', [filename]);

    await client.query('COMMIT');
    console.log(`✅ Executed migration: ${filename}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`❌ Failed to execute migration ${filename}:`, error.message);
    throw error;
  } finally {
    client.release();
  }
};

// Main migration function
const runMigrations = async () => {
  try {
    console.log('🔄 Starting database migrations...');

    // Create migrations table if it doesn't exist
    await createMigrationsTable();

    // Get list of migration files
    const migrationsDir = join(__dirname, '../backend/migrations');
    const migrationFiles = await readdir(migrationsDir);
    const sqlFiles = migrationFiles
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensure consistent order

    // Get already executed migrations
    const executedMigrations = await getExecutedMigrations();

    // Find pending migrations
    const pendingMigrations = sqlFiles.filter(file => !executedMigrations.includes(file));

    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }

    console.log(`📋 Found ${pendingMigrations.length} pending migration(s):`);
    pendingMigrations.forEach(file => console.log(`  - ${file}`));

    // Execute pending migrations
    for (const filename of pendingMigrations) {
      const filePath = join(migrationsDir, filename);
      const content = await readFile(filePath, 'utf8');
      await executeMigration(filename, content);
    }

    console.log('🎉 All migrations completed successfully!');

  } catch (error) {
    console.error('💥 Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run migrations
runMigrations();