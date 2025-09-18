import { db } from '../utils/database.js';
import { Info } from '../types/index.js';

export class InfoModel {
  static async findByTenantId(tenantId: number, featured?: boolean, type?: string, limit?: number, offset?: number): Promise<Info[]> {
    let query = `
      SELECT id, tenant_id, title, content, type, image_url, is_featured_banner, published_at, created_at, updated_at
      FROM info
      WHERE tenant_id = $1
    `;

    const params: any[] = [tenantId];
    let paramIndex = 2;

    if (featured !== undefined) {
      query += ` AND is_featured_banner = $${paramIndex}`;
      params.push(featured);
      paramIndex++;
    }

    if (type) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    query += ' ORDER BY published_at DESC';

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

  static async findById(id: number, tenantId: number): Promise<Info | null> {
    const query = `
      SELECT id, tenant_id, title, content, type, image_url, is_featured_banner, published_at, created_at, updated_at
      FROM info
      WHERE id = $1 AND tenant_id = $2
    `;

    const result = await db.query(query, [id, tenantId]);
    return result.rows[0] || null;
  }

  static async create(infoData: Omit<Info, 'id' | 'created_at' | 'updated_at'>): Promise<Info> {
    const query = `
      INSERT INTO info (tenant_id, title, content, type, image_url, is_featured_banner, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, tenant_id, title, content, type, image_url, is_featured_banner, published_at, created_at, updated_at
    `;

    const params = [
      infoData.tenant_id,
      infoData.title,
      infoData.content,
      infoData.type || 'general',
      infoData.image_url,
      infoData.is_featured_banner,
      infoData.published_at
    ];

    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async update(id: number, tenantId: number, infoData: Partial<Omit<Info, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>>): Promise<Info | null> {
    const updateFields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    Object.entries(infoData).forEach(([key, value]) => {
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
      UPDATE info
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex} AND tenant_id = $${paramIndex + 1}
      RETURNING id, tenant_id, title, content, type, image_url, is_featured_banner, published_at, created_at, updated_at
    `;

    params.push(id, tenantId);

    const result = await db.query(query, params);
    return result.rows[0] || null;
  }

  static async delete(id: number, tenantId: number): Promise<boolean> {
    const query = `
      DELETE FROM info
      WHERE id = $1 AND tenant_id = $2
    `;

    const result = await db.query(query, [id, tenantId]);
    return result.rowCount! > 0;
  }

  static async countByTenantId(tenantId: number, featured?: boolean, type?: string): Promise<number> {
    let query = 'SELECT COUNT(*) FROM info WHERE tenant_id = $1';
    const params: any[] = [tenantId];
    let paramIndex = 2;

    if (featured !== undefined) {
      query += ` AND is_featured_banner = $${paramIndex}`;
      params.push(featured);
      paramIndex++;
    }

    if (type) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
    }

    const result = await db.query(query, params);
    return parseInt(result.rows[0].count);
  }
}