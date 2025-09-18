import {
  ApiResponse,
  Event,
  Info,
  Banner,
  EventsResponse,
  InfoResponse,
  BannersResponse
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new ApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new ApiError(data.error || 'Unknown API error');
    }

    return data.data!;
  }

  // Events API
  async getEvents(options?: {
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<EventsResponse> {
    const params = new URLSearchParams();
    if (options?.featured !== undefined) params.append('featured', String(options.featured));
    if (options?.limit !== undefined) params.append('limit', String(options.limit));
    if (options?.offset !== undefined) params.append('offset', String(options.offset));

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<EventsResponse>(`/api/events${query}`);
  }

  async getEvent(id: number): Promise<{ event: Event }> {
    return this.request<{ event: Event }>(`/api/events/${id}`);
  }

  async createEvent(eventData: Partial<Event>): Promise<{ event: Event }> {
    return this.request<{ event: Event }>('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: number, eventData: Partial<Event>): Promise<{ event: Event }> {
    return this.request<{ event: Event }>(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id: number): Promise<void> {
    await this.request<void>(`/api/events/${id}`, {
      method: 'DELETE',
    });
  }

  // Info/News API
  async getInfo(options?: {
    featured?: boolean;
    type?: 'news' | 'announcement' | 'general';
    limit?: number;
    offset?: number;
  }): Promise<InfoResponse> {
    const params = new URLSearchParams();
    if (options?.featured !== undefined) params.append('featured', String(options.featured));
    if (options?.type) params.append('type', options.type);
    if (options?.limit !== undefined) params.append('limit', String(options.limit));
    if (options?.offset !== undefined) params.append('offset', String(options.offset));

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<InfoResponse>(`/api/info${query}`);
  }

  async getInfoById(id: number): Promise<{ info: Info }> {
    return this.request<{ info: Info }>(`/api/info/${id}`);
  }

  async createInfo(infoData: Partial<Info>): Promise<{ info: Info }> {
    return this.request<{ info: Info }>('/api/info', {
      method: 'POST',
      body: JSON.stringify(infoData),
    });
  }

  async updateInfo(id: number, infoData: Partial<Info>): Promise<{ info: Info }> {
    return this.request<{ info: Info }>(`/api/info/${id}`, {
      method: 'PUT',
      body: JSON.stringify(infoData),
    });
  }

  async deleteInfo(id: number): Promise<void> {
    await this.request<void>(`/api/info/${id}`, {
      method: 'DELETE',
    });
  }

  // Banners API
  async getBanners(options?: { limit?: number }): Promise<BannersResponse> {
    const params = new URLSearchParams();
    if (options?.limit !== undefined) params.append('limit', String(options.limit));

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<BannersResponse>(`/api/banners${query}`);
  }

  async getBanner(type: 'event' | 'info', id: number): Promise<{ banner: Banner }> {
    return this.request<{ banner: Banner }>(`/api/banners/${type}/${id}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export individual methods for convenience
export const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getInfo,
  getInfoById,
  createInfo,
  updateInfo,
  deleteInfo,
  getBanners,
  getBanner,
  healthCheck,
} = apiClient;

export { ApiError };