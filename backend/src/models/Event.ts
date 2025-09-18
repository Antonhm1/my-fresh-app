import { db } from '../utils/database.js';
import { Event } from '../types/index.js';

export class EventModel {
  static async findByTenantId(tenantId: number, featured?: boolean, limit?: number, offset?: number): Promise<Event[]> {
    let query = `
      SELECT id, tenant_id, title, description, start_date, end_date, location, image_url, is_featured_banner, created_at, updated_at
      FROM events
      WHERE tenant_id = $1
    `;

    const params: any[] = [tenantId];
    let paramIndex = 2;

    if (featured !== undefined) {
      query += ` AND is_featured_banner = $${paramIndex}`;
      params.push(featured);
      paramIndex++;
    }

    query += ' ORDER BY start_date ASC';

    if (limit !== undefined) {
      query += ` LIMIT $${paramIndex}`;
      params.push(limit);
      paramIndex++;
    }

    if (offset !== undefined) {
      query += ` OFFSET $${paramIndex}`;
      params.push(offset);
    }

    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id: number, tenantId: number): Promise<Event | null> {
    const query = `
      SELECT id, tenant_id, title, description, start_date, end_date, location, image_url, is_featured_banner, created_at, updated_at
      FROM events
      WHERE id = $1 AND tenant_id = $2
    `;

    const result = await db.query(query, [id, tenantId]);
    return result.rows[0] || null;
  }

  static async create(eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
    const query = `
      INSERT INTO events (tenant_id, title, description, start_date, end_date, location, image_url, is_featured_banner)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, tenant_id, title, description, start_date, end_date, location, image_url, is_featured_banner, created_at, updated_at
    `;

    const params = [
      eventData.tenant_id,
      eventData.title,
      eventData.description,
      eventData.start_date,
      eventData.end_date,
      eventData.location,
      eventData.image_url,
      eventData.is_featured_banner
    ];

    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async update(id: number, tenantId: number, eventData: Partial<Omit<Event, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>>): Promise<Event | null> {
    const updateFields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    Object.entries(eventData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = $${paramIndex}`);
        params.push(value);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      return this.findById(id, tenantId);
    }

    const query = `
      UPDATE events
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex} AND tenant_id = $${paramIndex + 1}
      RETURNING id, tenant_id, title, description, start_date, end_date, location, image_url, is_featured_banner, created_at, updated_at
    `;

    params.push(id, tenantId);

    const result = await db.query(query, params);
    return result.rows[0] || null;
  }

  static async delete(id: number, tenantId: number): Promise<boolean> {
    const query = `
      DELETE FROM events
      WHERE id = $1 AND tenant_id = $2
    `;

    const result = await db.query(query, [id, tenantId]);
    return result.rowCount! > 0;
  }

  static async countByTenantId(tenantId: number, featured?: boolean): Promise<number> {
    let query = 'SELECT COUNT(*) FROM events WHERE tenant_id = $1';
    const params: any[] = [tenantId];

    if (featured !== undefined) {
      query += ' AND is_featured_banner = $2';
      params.push(featured);
    }

    const result = await db.query(query, params);
    return parseInt(result.rows[0].count);
  }
}