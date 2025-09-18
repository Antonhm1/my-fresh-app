// API Types matching backend interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Event {
  id: number;
  tenant_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  location?: string;
  image_url?: string;
  is_featured_banner: boolean;
  created_at: string;
  updated_at: string;
}

export interface Info {
  id: number;
  tenant_id: number;
  title: string;
  content: string;
  type: 'news' | 'announcement' | 'general';
  image_url?: string;
  is_featured_banner: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: number;
  title: string;
  description?: string;
  content?: string;
  image_url?: string;
  type: 'event' | 'info';
  date?: string;
  location?: string;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface EventsResponse {
  events: Event[];
  pagination: PaginationMeta;
}

export interface InfoResponse {
  info: Info[];
  pagination: PaginationMeta;
}

export interface BannersResponse {
  banners: Banner[];
  meta: {
    total: number;
    limit: number;
    events_count: number;
    info_count: number;
  };
}