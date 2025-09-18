import { Response } from 'express';
import { TenantRequest, ApiResponse, QueryParams } from '../types/index.js';
import { InfoModel } from '../models/Info.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

interface InfoQueryParams extends QueryParams {
  type?: string;
}

export const getInfo = asyncHandler(async (req: TenantRequest, res: Response<ApiResponse>) => {
  const tenant = req.tenant!;
  const { featured, type, limit, offset } = req.query as InfoQueryParams;

  // Convert query params to proper types
  const featuredBoolean = featured === true || featured === 'true' ? true : featured === 'false' ? false : undefined;
  const limitNumber = limit ? parseInt(limit.toString()) : undefined;
  const offsetNumber = offset ? parseInt(offset.toString()) : undefined;

  // Validate pagination parameters
  if (limitNumber !== undefined && (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100)) {
    throw new AppError('Limit must be between 1 and 100', 400);
  }

  if (offsetNumber !== undefined && (isNaN(offsetNumber) || offsetNumber < 0)) {
    throw new AppError('Offset must be 0 or greater', 400);
  }

  // Validate type parameter
  if (type && !['news', 'announcement', 'general'].includes(type.toString())) {
    throw new AppError('Type must be one of: news, announcement, general', 400);
  }

  try {
    const info = await InfoModel.findByTenantId(
      tenant.id,
      featuredBoolean,
      type?.toString(),
      limitNumber,
      offsetNumber
    );

    const totalCount = await InfoModel.countByTenantId(tenant.id, featuredBoolean, type?.toString());

    res.json({
      success: true,
      data: {
        info,
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
    throw new AppError('Failed to fetch info', 500);
  }
});

export const getInfoById = asyncHandler(async (req: TenantRequest, res: Response<ApiResponse>) => {
  const tenant = req.tenant!;
  const infoId = parseInt(req.params.id);

  if (isNaN(infoId)) {
    throw new AppError('Invalid info ID', 400);
  }

  try {
    const info = await InfoModel.findById(infoId, tenant.id);

    if (!info) {
      throw new AppError('Info not found', 404);
    }

    res.json({
      success: true,
      data: { info }
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch info', 500);
  }
});

export const createInfo = asyncHandler(async (req: TenantRequest, res: Response<ApiResponse>) => {
  const tenant = req.tenant!;
  const infoData = req.body;

  // Validate required fields
  const requiredFields = ['title', 'content'];
  for (const field of requiredFields) {
    if (!infoData[field]) {
      throw new AppError(`Missing required field: ${field}`, 400);
    }
  }

  // Validate type field
  if (infoData.type && !['news', 'announcement', 'general'].includes(infoData.type)) {
    throw new AppError('Type must be one of: news, announcement, general', 400);
  }

  // Validate published_at date format if provided
  let publishedAt = new Date();
  if (infoData.published_at) {
    publishedAt = new Date(infoData.published_at);
    if (isNaN(publishedAt.getTime())) {
      throw new AppError('Invalid published_at format', 400);
    }
  }

  try {
    const info = await InfoModel.create({
      tenant_id: tenant.id,
      title: infoData.title,
      content: infoData.content,
      type: infoData.type || 'general',
      image_url: infoData.image_url || null,
      is_featured_banner: infoData.is_featured_banner || false,
      published_at: publishedAt
    });

    res.status(201).json({
      success: true,
      data: { info },
      message: 'Info created successfully'
    });
  } catch (error) {
    throw new AppError('Failed to create info', 500);
  }
});

export const updateInfo = asyncHandler(async (req: TenantRequest, res: Response<ApiResponse>) => {
  const tenant = req.tenant!;
  const infoId = parseInt(req.params.id);
  const updateData = req.body;

  if (isNaN(infoId)) {
    throw new AppError('Invalid info ID', 400);
  }

  // Validate type field if provided
  if (updateData.type && !['news', 'announcement', 'general'].includes(updateData.type)) {
    throw new AppError('Type must be one of: news, announcement, general', 400);
  }

  // Validate published_at date format if provided
  if (updateData.published_at) {
    const publishedAt = new Date(updateData.published_at);
    if (isNaN(publishedAt.getTime())) {
      throw new AppError('Invalid published_at format', 400);
    }
    updateData.published_at = publishedAt;
  }

  try {
    const info = await InfoModel.update(infoId, tenant.id, updateData);

    if (!info) {
      throw new AppError('Info not found', 404);
    }

    res.json({
      success: true,
      data: { info },
      message: 'Info updated successfully'
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to update info', 500);
  }
});

export const deleteInfo = asyncHandler(async (req: TenantRequest, res: Response<ApiResponse>) => {
  const tenant = req.tenant!;
  const infoId = parseInt(req.params.id);

  if (isNaN(infoId)) {
    throw new AppError('Invalid info ID', 400);
  }

  try {
    const deleted = await InfoModel.delete(infoId, tenant.id);

    if (!deleted) {
      throw new AppError('Info not found', 404);
    }

    res.json({
      success: true,
      message: 'Info deleted successfully'
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to delete info', 500);
  }
});