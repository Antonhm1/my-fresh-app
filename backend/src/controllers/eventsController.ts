import { Response } from 'express';
import { TenantRequest, ApiResponse, QueryParams } from '../types/index.js';
import { EventModel } from '../models/Event.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

export const getEvents = asyncHandler(async (req: TenantRequest, res: Response<ApiResponse>) => {
  const tenant = req.tenant!;
  const { featured, limit, offset } = req.query;

  // Convert query params to proper types
  const featuredBoolean = featured === 'true' ? true : featured === 'false' ? false : undefined;
  const limitNumber = limit ? parseInt(limit.toString()) : undefined;
  const offsetNumber = offset ? parseInt(offset.toString()) : undefined;

  // Validate pagination parameters
  if (limitNumber !== undefined && (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100)) {
    throw new AppError('Limit must be between 1 and 100', 400);
  }

  if (offsetNumber !== undefined && (isNaN(offsetNumber) || offsetNumber < 0)) {
    throw new AppError('Offset must be 0 or greater', 400);
  }

  try {
    const events = await EventModel.findByTenantId(
      tenant.id,
      featuredBoolean,
      limitNumber,
      offsetNumber
    );

    const totalCount = await EventModel.countByTenantId(tenant.id, featuredBoolean);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          total: totalCount,
          limit: limitNumber || totalCount,
          offset: offsetNumber || 0,
          hasMore: offsetNumber !== undefined && limitNumber !== undefined
            ? (offsetNumber + limitNumber) < totalCount
            : false
        }
      }
    });
  } catch (error) {
    throw new AppError('Failed to fetch events', 500);
  }
});

export const getEventById = asyncHandler(async (req: TenantRequest, res: Response<ApiResponse>) => {
  const tenant = req.tenant!;
  const eventId = parseInt(req.params.id);

  if (isNaN(eventId)) {
    throw new AppError('Invalid event ID', 400);
  }

  try {
    const event = await EventModel.findById(eventId, tenant.id);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    res.json({
      success: true,
      data: { event }
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch event', 500);
  }
});

export const createEvent = asyncHandler(async (req: TenantRequest, res: Response<ApiResponse>) => {
  const tenant = req.tenant!;
  const eventData = req.body;

  // Validate required fields
  const requiredFields = ['title', 'start_date'];
  for (const field of requiredFields) {
    if (!eventData[field]) {
      throw new AppError(`Missing required field: ${field}`, 400);
    }
  }

  // Validate date format
  const startDate = new Date(eventData.start_date);
  if (isNaN(startDate.getTime())) {
    throw new AppError('Invalid start_date format', 400);
  }

  if (eventData.end_date) {
    const endDate = new Date(eventData.end_date);
    if (isNaN(endDate.getTime())) {
      throw new AppError('Invalid end_date format', 400);
    }
    if (endDate < startDate) {
      throw new AppError('End date cannot be before start date', 400);
    }
  }

  try {
    const event = await EventModel.create({
      tenant_id: tenant.id,
      title: eventData.title,
      description: eventData.description || null,
      start_date: startDate,
      end_date: eventData.end_date ? new Date(eventData.end_date) : undefined,
      location: eventData.location || null,
      image_url: eventData.image_url || null,
      is_featured_banner: eventData.is_featured_banner || false
    });

    res.status(201).json({
      success: true,
      data: { event },
      message: 'Event created successfully'
    });
  } catch (error) {
    throw new AppError('Failed to create event', 500);
  }
});

export const updateEvent = asyncHandler(async (req: TenantRequest, res: Response<ApiResponse>) => {
  const tenant = req.tenant!;
  const eventId = parseInt(req.params.id);
  const updateData = req.body;

  if (isNaN(eventId)) {
    throw new AppError('Invalid event ID', 400);
  }

  // Validate date formats if provided
  if (updateData.start_date) {
    const startDate = new Date(updateData.start_date);
    if (isNaN(startDate.getTime())) {
      throw new AppError('Invalid start_date format', 400);
    }
    updateData.start_date = startDate;
  }

  if (updateData.end_date) {
    const endDate = new Date(updateData.end_date);
    if (isNaN(endDate.getTime())) {
      throw new AppError('Invalid end_date format', 400);
    }
    updateData.end_date = endDate;
  }

  try {
    const event = await EventModel.update(eventId, tenant.id, updateData);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    res.json({
      success: true,
      data: { event },
      message: 'Event updated successfully'
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to update event', 500);
  }
});

export const deleteEvent = asyncHandler(async (req: TenantRequest, res: Response<ApiResponse>) => {
  const tenant = req.tenant!;
  const eventId = parseInt(req.params.id);

  if (isNaN(eventId)) {
    throw new AppError('Invalid event ID', 400);
  }

  try {
    const deleted = await EventModel.delete(eventId, tenant.id);

    if (!deleted) {
      throw new AppError('Event not found', 404);
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to delete event', 500);
  }
});