# Issue #6: Backend Setup Analysis and Plan

**Issue Link:** https://github.com/Antonhm1/minKirke-code/issues/6

## Problem Analysis

This issue requires setting up a complete Node.js + Express + PostgreSQL backend with multi-tenant architecture for church websites. The current codebase is a React frontend only, but already has some backend infrastructure prepared:

### Current State
- ✅ Package.json has backend scripts and dependencies (supertest, msw)
- ✅ vitest.config.backend.ts is configured for backend testing
- ❌ No backend/ directory exists yet
- ❌ No scripts/ directory for migrations
- ❌ No database setup
- ❌ No Express server

### Requirements from Issue
1. **Multi-tenant architecture** - Single database with tenant_id isolation
2. **Database Schema:**
   - `tenants` table (id, name, domain, settings)
   - `events` table with tenant_id and is_featured_banner flag
   - `info` table with tenant_id and is_featured_banner flag
3. **Key Features:**
   - Tenant-aware REST endpoints
   - Combined banners from featured events/info
   - Single tenant for now (Gislev Kirke)

## Implementation Plan

### Phase 1: Foundation Setup
1. **Backend Structure**
   - Create backend/ directory with proper TypeScript setup
   - Set up Express server with middleware
   - Configure environment variables and error handling

2. **Database Setup**
   - Install PostgreSQL dependencies (pg, @types/pg)
   - Create database connection with pooling
   - Set up migration system

3. **Database Schema**
   - Create migration for tenants table
   - Create migration for events table
   - Create migration for info table
   - Seed with Gislev Kirke tenant data

4. **Basic Middleware**
   - Tenant resolution middleware
   - Error handling middleware
   - Request logging

### Phase 2: Core API Development
1. **Events API**
   - GET /api/events (with optional ?featured=true)
   - Automatic tenant scoping
   - Proper error handling and validation

2. **Info/News API**
   - GET /api/info (with optional ?featured=true)
   - Automatic tenant scoping
   - Proper error handling and validation

3. **Banners API**
   - GET /api/banners (combined featured events + info)
   - Tenant-aware aggregation

### Phase 3: Frontend Integration
1. **API Client Utilities**
   - Create tenant-aware API client
   - Add loading states and error handling

2. **Component Updates**
   - Replace hardcoded data in HomePage components
   - Update Events component to use API
   - Update News/Info components to use API

### Testing Strategy
- Unit tests for all API endpoints
- Integration tests for database operations
- E2E tests for complete workflows
- Use existing test infrastructure (vitest, supertest)

## Technical Decisions

### Database Design
- **Single database approach** with tenant_id column for isolation
- **No separate banners table** - use is_featured_banner boolean
- **PostgreSQL** for robust data handling
- **Connection pooling** for performance

### Architecture
- **Express.js** for REST API
- **TypeScript** for type safety
- **Middleware-based** tenant resolution
- **Environment-based** configuration

### Dependencies to Add
- `express` and `@types/express`
- `pg` and `@types/pg`
- `dotenv` for environment variables
- `cors` for frontend communication
- `helmet` for security headers

## Success Criteria
- ✅ All backend tests passing
- ✅ Frontend successfully loads data from API
- ✅ Tenant isolation working correctly
- ✅ Featured banners displaying properly
- ✅ No hardcoded data in frontend components