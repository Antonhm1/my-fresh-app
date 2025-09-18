import { Request } from 'express';

export interface Tenant {
  id: number;
  name: string;
  domain: string;
  settings: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Event {
  id: number;
  tenant_id: number;
  title: string;
  description: string;
  start_date: Date;
  end_date?: Date;
  location?: string;
  image_url?: string;
  is_featured_banner: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Info {
  id: number;
  tenant_id: number;
  title: string;
  content: string;
  type: 'news' | 'announcement' | 'general';
  image_url?: string;
  is_featured_banner: boolean;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Banner {
  id: number;
  title: string;
  description?: string;
  content?: string;
  image_url?: string;
  type: 'event' | 'info';
  date?: Date;
  location?: string;
}

export interface TenantRequest extends Request {
  tenant?: Tenant;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface QueryParams {
  featured?: boolean;
  limit?: number;
  offset?: number;
}