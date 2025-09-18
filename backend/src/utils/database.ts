import { Pool, PoolClient, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
  min: number;
  max: number;
  idleTimeoutMillis: number;
}

const getDatabaseConfig = (): DatabaseConfig => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'gislev_kirke_dev',
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  ssl: process.env.DATABASE_SSL === 'true',
  min: parseInt(process.env.DATABASE_POOL_MIN || '2'),
  max: parseInt(process.env.DATABASE_POOL_MAX || '10'),
  idleTimeoutMillis: parseInt(process.env.DATABASE_POOL_IDLE_TIMEOUT || '30000'),
});

class Database {
  private pool: Pool;
  private static instance: Database;

  private constructor() {
    const config = getDatabaseConfig();

    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
      min: config.min,
      max: config.max,
      idleTimeoutMillis: config.idleTimeoutMillis,
    });

    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('PostgreSQL pool error:', err);
    });

    // Log pool connection info
    this.pool.on('connect', () => {
      console.log('New database connection established');
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async query(text: string, params?: any[]): Promise<QueryResult> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;

      if (process.env.NODE_ENV === 'development') {
        console.log('Query executed:', {
          text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
          duration: `${duration}ms`,
          rows: result.rowCount
        });
      }

      return result;
    } catch (error) {
      console.error('Database query error:', {
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        error: error instanceof Error ? error.message : error
      });
      throw error;
    }
  }

  public async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  public async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1 as healthy');
      return result.rows[0]?.healthy === 1;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
    console.log('Database connection pool closed');
  }

  public getPoolInfo() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount
    };
  }
}

export const db = Database.getInstance();
export default Database;