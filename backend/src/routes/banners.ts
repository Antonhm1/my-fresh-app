import { Router } from 'express';
import {
  getBanners,
  getBannerById
} from '../controllers/bannersController.js';

const router = Router();

// GET /api/banners - Get all featured banners (combined events and info)
router.get('/', getBanners);

// GET /api/banners/:type/:id - Get specific banner by type and ID
router.get('/:type/:id', getBannerById);

export { router as bannersRouter };