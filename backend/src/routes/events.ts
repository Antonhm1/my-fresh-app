import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventsController.js';

const router = Router();

// GET /api/events - Get all events for tenant (with optional featured filter)
router.get('/', getEvents);

// GET /api/events/:id - Get specific event by ID
router.get('/:id', getEventById);

// POST /api/events - Create new event
router.post('/', createEvent);

// PUT /api/events/:id - Update event
router.put('/:id', updateEvent);

// DELETE /api/events/:id - Delete event
router.delete('/:id', deleteEvent);

export { router as eventsRouter };