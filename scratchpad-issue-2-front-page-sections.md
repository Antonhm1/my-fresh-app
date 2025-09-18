# Issue #2: Create sections for the front page

**GitHub Issue**: https://github.com/Antonhm1/my-fresh-app/issues/2

## Problem Statement
Create different sections on the front page as React components:
1. Banner preview (first section)
2. Banners section with grid layout and Banner components
3. Events section with Event components (rectangular, narrow, full-width)
4. Footer section (appears on all pages)
5. Each section should have different background colors
6. Populate with dummy data

## Current State Analysis
- HomePage component is very basic (title + paragraph)
- Project uses React Router with structured component organization
- Components in folders with index.ts exports
- No existing sections or complex layout

## Implementation Plan

### Step 1: Create Component Structure
- Create `BannerPreview` component in `/src/components/BannerPreview/`
- Create `Banner` component in `/src/components/Banner/`
- Create `Banners` section component in `/src/components/Banners/`
- Create `Event` component in `/src/components/Event/`
- Create `Events` section component in `/src/components/Events/`
- Create `Footer` component in `/src/components/Footer/`

### Step 2: Component Design Specifications
**BannerPreview**:
- First section on homepage
- Background color: light blue (#f0f8ff)

**Banner Component**:
- Contains image and text underneath
- Used in grid layout

**Banners Section**:
- Grid layout containing multiple Banner components
- Background color: light gray (#f5f5f5)

**Event Component**:
- Rectangular with narrow height
- Spans almost full width
- Contains event information

**Events Section**:
- Stacks Event components vertically
- Background color: light green (#f0fff0)

**Footer**:
- Appears on all pages (add to App.tsx)
- Background color: dark blue (#2c3e50)

### Step 3: Implementation Order
1. Create BannerPreview component
2. Create Banner component and Banners section
3. Create Event component and Events section
4. Create Footer component
5. Update HomePage to use all sections
6. Move Footer to App.tsx for all pages
7. Add CSS styling with background colors
8. Populate with dummy data

### Step 4: Testing
- Test visual layout and responsiveness
- Run full test suite
- Verify footer appears on all pages

## Dummy Data
**Banners**: Church events, services, community activities
**Events**: Sunday services, Bible study, community meetings, special occasions