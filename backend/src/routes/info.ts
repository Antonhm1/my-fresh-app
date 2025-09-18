import { Router } from 'express';
import {
  getInfo,
  getInfoById,
  createInfo,
  updateInfo,
  deleteInfo
} from '../controllers/infoController.js';

const router = Router();

// GET /api/info - Get all info/news for tenant (with optional featured and type filters)
router.get('/', getInfo);

// GET /api/info/:id - Get specific info by ID
router.get('/:id', getInfoById);

// POST /api/info - Create new info
router.post('/', createInfo);

// PUT /api/info/:id - Update info
router.put('/:id', updateInfo);

// DELETE /api/info/:id - Delete info
router.delete('/:id', deleteInfo);

export { router as infoRouter };