import { Response } from 'express';
import { TenantRequest, ApiResponse, Banner } from '../types/index.js';
import { EventModel } from '../models/Event.js';
import { InfoModel } from '../models/Info.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

export const getBanners = asyncHandler(async (req: TenantRequest, res: Response<ApiResponse>) => {
  const tenant = req.tenant!;
  const { limit } = req.query;

  // Convert limit to number if provided
  const limitNumber = limit ? parseInt(limit.toString()) : 10;

  // Validate limit parameter
  if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 50) {
    throw new AppError('Limit must be between 1 and 50', 400);
  }

  try {
    // Fetch featured events and info concurrently
    const [featuredEvents, featuredInfo] = await Promise.all([
      EventModel.findByTenantId(tenant.id, true), // Only featured events
      InfoModel.findByTenantId(tenant.id, true)   // Only featured info
    ]);

    // Transform events to banner format
    const eventBanners: Banner[] = featuredEvents.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description || undefined,
      image_url: event.image_url || undefined,
      type: 'event' as const,
      date: event.start_date,
      location: event.location || undefined
    }));

    // Transform info to banner format
    const infoBanners: Banner[] = featuredInfo.map(info => ({
      id: info.id,
      title: info.title,
      content: info.content,
      image_url: info.image_url || undefined,
      type: 'info' as const,
      date: info.published_at
    }));

    // Combine and sort by date (most recent first)
    const allBanners = [...eventBanners, ...infoBanners]
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA; // Descending order (newest first)
      })
      .slice(0, limitNumber); // Apply limit

    res.json({
      success: true,
      data: {
        banners: allBanners,
        meta: {
          total: allBanners.length,
          limit: limitNumber,
          events_count: eventBanners.length,
          info_count: infoBanners.length
        }
      }
    });
  } catch (error) {
    console.error('Failed to fetch banners:', error);
    throw new AppError('Failed to fetch banners', 500);
  }
});

export const getBannerById = asyncHandler(async (req: TenantRequest, res: Response<ApiResponse>) => {
  const tenant = req.tenant!;
  const { id, type } = req.params;

  const bannerId = parseInt(id);

  if (isNaN(bannerId)) {
    throw new AppError('Invalid banner ID', 400);
  }

  if (!['event', 'info'].includes(type)) {
    throw new AppError('Type must be either "event" or "info"', 400);
  }

  try {
    let banner: Banner | null = null;

    if (type === 'event') {
      const event = await EventModel.findById(bannerId, tenant.id);
      if (event && event.is_featured_banner) {
        banner = {
          id: event.id,
          title: event.title,
          description: event.description || undefined,
          image_url: event.image_url || undefined,
          type: 'event' as const,
          date: event.start_date,
          location: event.location || undefined
        };
      }
    } else if (type === 'info') {
      const info = await InfoModel.findById(bannerId, tenant.id);
      if (info && info.is_featured_banner) {
        banner = {
          id: info.id,
          title: info.title,
          content: info.content,
          image_url: info.image_url || undefined,
          type: 'info' as const,
          date: info.published_at
        };
      }
    }

    if (!banner) {
      throw new AppError(`Banner not found or not featured`, 404);
    }

    res.json({
      success: true,
      data: { banner }
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch banner', 500);
  }
});