import { Request, Response, NextFunction } from 'express';
import { TenantRequest, Tenant } from '../types/index.js';
import { AppError } from './errorHandler.js';

// For now, we'll use a hardcoded tenant for Gislev Kirke
// This can be expanded later to support multiple tenants
const GISLEV_KIRKE_TENANT: Tenant = {
  id: 1,
  name: 'Gislev Kirke',
  domain: 'gislevkirke.dk',
  settings: {
    theme: 'default',
    language: 'da',
    timezone: 'Europe/Copenhagen'
  },
  created_at: new Date('2025-01-01'),
  updated_at: new Date()
};

export const tenantMiddleware = (
  req: TenantRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // For now, always use Gislev Kirke as the tenant
    // In the future, this could resolve tenant by:
    // - Custom domain (req.hostname)
    // - Subdomain (req.subdomains)
    // - Header value (req.headers['x-tenant'])
    // - URL parameter (?tenant=gislev)

    req.tenant = GISLEV_KIRKE_TENANT;

    // Add tenant info to response headers for debugging
    res.setHeader('X-Tenant-ID', req.tenant.id);
    res.setHeader('X-Tenant-Name', req.tenant.name);

    next();
  } catch (error) {
    next(new AppError('Failed to resolve tenant', 500));
  }
};

export const getTenantById = (id: number): Tenant | null => {
  // For now, only Gislev Kirke exists
  return id === 1 ? GISLEV_KIRKE_TENANT : null;
};

export const getTenantByDomain = (domain: string): Tenant | null => {
  // For now, only Gislev Kirke exists
  return domain === 'gislevkirke.dk' ? GISLEV_KIRKE_TENANT : null;
};